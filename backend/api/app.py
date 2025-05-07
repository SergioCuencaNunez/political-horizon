from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import sqlite3
import jwt
from functools import wraps
import pytz
from datetime import datetime
from backend.models.recommendation_function import recommend_articles_bias_controlled

app = Flask(__name__)
CORS(app)

SECRET_KEY = "secret_key"

# Load POLUSA dataset
polusa_balanced = pd.read_csv("backend/data/polusa_balanced.csv", header=0)

# Minimum seconds to consider "interested"
READ_TIME_INTERESTED = 120
READ_TIME_NOT_INTERESTED = 30

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
@app.route("/recommendations", methods=["POST"])
@verify_token
def generate_recommendations():
    user_id = request.user.get("id")
    if not user_id:
        return jsonify({"error": "User ID missing in token"}), 403

    conn = sqlite3.connect("backend/db/database.db")
    cursor = conn.cursor()

    try:
        # Get the last recommendation request timestamp
        cursor.execute("SELECT last_recommendation_timestamp FROM users WHERE id = ?", (user_id,))
        last_recommendation_time = cursor.fetchone()
        last_recommendation_time = last_recommendation_time[0] if last_recommendation_time and last_recommendation_time[0] else None

        if last_recommendation_time:
            cursor.execute("""
                SELECT id, interaction_type, read_time_seconds 
                FROM interactions 
                WHERE user_id = ? AND interaction_timestamp > ?
            """, (user_id, last_recommendation_time))
        else:
            cursor.execute("""
                SELECT id, interaction_type, read_time_seconds 
                FROM interactions 
                WHERE user_id = ?
            """, (user_id,))

        interactions = cursor.fetchall()
        recommendations = []

        for article_id, interaction_type, read_time_seconds in interactions:
            if interaction_type == "like":
                interaction_type_final = "like"
            elif interaction_type == "read" and read_time_seconds >= READ_TIME_INTERESTED:
                interaction_type_final = "read"
            elif interaction_type == "dislike" or read_time_seconds < READ_TIME_NOT_INTERESTED:
                interaction_type_final = "dislike"
            else:
                continue

            cursor.execute("SELECT headline, outlet FROM news_articles WHERE id = ?", (article_id,))
            row = cursor.fetchone()
            if row:
                source_headline, source_outlet = row
            else:
                source_headline = "An article you engaged with"
                source_outlet = "An unknown source"

            recommended_articles = recommend_articles_bias_controlled(article_id, polusa_balanced)

            if recommended_articles is not None:
                for _, rec in recommended_articles.iterrows():
                    recommendations.append({
                        "id": int(rec["id"]),
                        "interaction_type": interaction_type_final,
                        "source_article_id": article_id,
                        "source_article_headline": source_headline,
                        "source_article_outlet": source_outlet,
                        "date_publish": rec["date_publish"],
                        "headline": rec["headline"],
                        "outlet": rec["outlet"],
                        "url": rec["url"],
                        "political_leaning": rec["political_leaning"]
                    })

        for rec in recommendations:
            # Check if the recommendation already exists
            cursor.execute("""
                SELECT 1 FROM recommendations
                WHERE user_id = ? AND id = ?
            """, (user_id, rec["id"]))
            
            exists = cursor.fetchone()
            if exists:
                continue  # Skip if already exists

            # If not exists, insert the recommendation
            cursor.execute("""
                INSERT INTO recommendations (
                    id, user_id, interaction_type, source_article_id,
                    source_article_headline, date_publish, headline, outlet, url, political_leaning
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                rec["id"], user_id, rec["interaction_type"], rec["source_article_id"],
                rec["source_article_headline"], rec["date_publish"], rec["headline"],
                rec["outlet"], rec["url"], rec["political_leaning"]
            ))

        # Update last recommendation request time
        local_time = datetime.now(pytz.timezone('Europe/Madrid')).strftime('%Y-%m-%d %H:%M:%S')
        cursor.execute("UPDATE users SET last_recommendation_timestamp = ? WHERE id = ?",(local_time, user_id))

        conn.commit()

        return jsonify({
            "success": True,
            "recommendations": [r for r in recommendations if r["interaction_type"] in ("like", "read")]
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5002)
