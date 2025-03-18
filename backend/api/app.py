from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import sqlite3
import jwt
from functools import wraps
from datetime import datetime, timezone, timedelta
from backend.models.recommendation_function import recommend_articles_bias_controlled

app = Flask(__name__)
CORS(app)

SECRET_KEY = "secret_key"

# Load POLUSA dataset
polusa_balanced = pd.read_csv("backend/data/polusa_balanced.csv", header=0)

# Minimum seconds to consider "interested"
READ_TIME_THRESHOLD = 120

def verify_token(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            return jsonify({"error": "Authorization header missing"}), 403
        
        token = auth_header.split(" ")[1]
        try:
            decoded_token = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            request.user = decoded_token
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token has expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401
        
        return func(*args, **kwargs)
    return wrapper

# Generates personalized recommendations based on user's interactions
@app.route("/user/generate-recommendations", methods=["POST"])
@verify_token
def generate_recommendations():
    user_id = request.user.get("id")
    if not user_id:
        return jsonify({"error": "User ID missing in token"}), 403

    # Connect to SQLite Database
    conn = sqlite3.connect("backend/db/database.db")
    cursor = conn.cursor()

    try:
        # Get the last recommendation request timestamp
        cursor.execute("SELECT last_recommendation_timestamp FROM users WHERE id = ?", (user_id,))
        last_recommendation_time = cursor.fetchone()

        # If no previous recommendations, default to 24 hours ago
        if last_recommendation_time and last_recommendation_time[0]:
            last_recommendation_time = last_recommendation_time[0]
        else:
            last_recommendation_time = (datetime.now(timezone.utc) - timedelta(hours=24)).strftime('%Y-%m-%d %H:%M:%S')

        # Fetch only NEW interactions since the last recommendation request
        cursor.execute("""
            SELECT news_id, interaction_type, read_time_seconds 
            FROM user_interactions 
            WHERE user_id = ? AND interaction_timestamp > ?
        """, (user_id, last_recommendation_time))

        interactions = cursor.fetchall()

        # Separate interactions by type
        liked_articles = set()
        read_articles = set()
        disliked_articles = set()

        for news_id, interaction_type, read_time_seconds in interactions:
            if interaction_type == "like":
                liked_articles.add(news_id)
            elif interaction_type == "dislike":
                disliked_articles.add(news_id)
            elif interaction_type == "read" and read_time_seconds >= READ_TIME_THRESHOLD:
                read_articles.add(news_id)  # Only recommend if read for long enough

        # Get all articles to use for recommendations
        candidate_articles = liked_articles.union(read_articles)

        # If no valid articles to recommend from, return empty
        if not candidate_articles:
            return jsonify({"error": "No valid articles for recommendations. Try liking or reading some articles first."}), 400

        recommendations = []

        for article_id in candidate_articles:
            cursor.execute("SELECT headline FROM news_articles WHERE id = ?", (article_id,))
            source_headline = cursor.fetchone()
            source_headline = source_headline[0] if source_headline else "an article you engaged with"

            recommended_articles = recommend_articles_bias_controlled(article_id, polusa_balanced)

            if recommended_articles is not None:
                for _, rec in recommended_articles.iterrows():
                    if rec["id"] not in disliked_articles:  # Exclude disliked-related recommendations
                        recommendations.append({
                            "id": int(rec["id"]),
                            "source_article_headline": source_headline,
                            "date_publish": rec["date_publish"],
                            "headline": rec["headline"],
                            "outlet": rec["outlet"],
                            "url": rec["url"],
                            "political_leaning": rec["political_leaning"]
                        })

        # Store recommendations in database
        for rec in recommendations:
            cursor.execute("""
                INSERT INTO user_recommendations (id, user_id, source_article_headline, date_publish, headline, outlet, url, political_leaning) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (rec["id"], user_id, rec["source_article_headline"], rec["date_publish"], rec["headline"], rec["outlet"], rec["url"], rec["political_leaning"]))

        cursor.execute("""
            UPDATE users SET last_recommendation_timestamp = ? WHERE id = ?
        """, (datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S'), user_id))

        conn.commit()

        return jsonify({"success": True, "recommendations": recommendations})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5002)
