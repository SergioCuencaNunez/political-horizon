import pandas as pd
from collections import Counter
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.neighbors import NearestNeighbors

def fairness_re_ranking(recommendations, max_per_outlet = 2):
    outlet_counts = Counter()
    balanced_recommendations = []

    for _, row in recommendations.iterrows():
        if outlet_counts[row['outlet']] < max_per_outlet:
            balanced_recommendations.append(row)
            outlet_counts[row['outlet']] += 1

    return pd.DataFrame(balanced_recommendations).reset_index(drop = True)

def enforce_political_diversity(recommendations, primary_weight, top_n = 5):    
    primary_leaning = recommendations.iloc[0]["political_leaning"]
    
    if primary_leaning == "LEFT":
        secondary_leanings = ["CENTER", "RIGHT"]
    elif primary_leaning == "RIGHT":
        secondary_leanings = ["CENTER", "LEFT"]
    else:
        secondary_leanings = ["LEFT", "RIGHT"]

    quota = {primary_leaning: primary_weight}  # Ensure primary leaning gets at least `primary_weight` recommendations
    for secondary in secondary_leanings:
        quota[secondary] = (top_n - primary_weight) // 2  # Split remaining spots equally
    
    # Ensure at least one article from each category is included
    quota[secondary_leanings[0]] += 1

    selected_articles = []
    remaining_articles = recommendations.copy()

    # Enforce the adjusted quotas
    for leaning, min_count in quota.items():
        candidates = remaining_articles[remaining_articles["political_leaning"] == leaning].head(min_count)
        selected_articles.extend(candidates.to_dict("records"))
        remaining_articles = remaining_articles[~remaining_articles["id"].isin([a["id"] for a in selected_articles])]

    sorted_remaining = remaining_articles.to_dict("records")
    selected_articles.extend(sorted_remaining[:top_n - len(selected_articles)])

    return pd.DataFrame(selected_articles).reset_index(drop=True)

def recommend_articles_bias_controlled(article_id, df, primary_weight = 2, top_n = 5, base_days_window = 5, max_days_window = 10):
    # Step 1: Get reference date & adaptively filter articles within the rolling window
    reference_date = pd.to_datetime(df.loc[df['id'] == article_id, 'date_publish']).values[0]
    reference_date = pd.to_datetime(reference_date).date()

    min_date = reference_date - pd.Timedelta(days = base_days_window)
    max_date = reference_date + pd.Timedelta(days = base_days_window)

    df['date_only'] = pd.to_datetime(df['date_publish']).dt.date
    time_filtered_df = df[(df['date_only'] >= min_date) & (df['date_only'] <= max_date)].copy()
    
    # Expand window if too few articles exist
    while len(time_filtered_df) < top_n * 3 and (max_date - reference_date).days < max_days_window:
        min_date -= pd.Timedelta(days = 1)
        max_date += pd.Timedelta(days = 1)
        time_filtered_df = df[(df['date_only'] >= min_date) & (df['date_only'] <= max_date)].copy()

    time_filtered_df = time_filtered_df.drop(columns = ['date_only']).reset_index(drop = True)

    # Step 2: Handle case where too few articles exist
    if len(time_filtered_df) < top_n:
        return time_filtered_df[['id', 'date_publish', 'headline', 'outlet', 'url', 'political_leaning']].head(top_n)

    # Step 3: Compute TF-IDF for time-filtered articles & fit Nearest Neighbors model
    vectorizer = TfidfVectorizer(max_features = 50_000)
    tfidf_filtered = vectorizer.fit_transform(time_filtered_df['text_cleaned'])

    nn_filtered = NearestNeighbors(n_neighbors = min(top_n * 3, len(time_filtered_df)), metric = 'cosine', algorithm = 'auto', n_jobs = -1)
    nn_filtered.fit(tfidf_filtered)

    # Step 4: Find correct index of article in filtered dataset
    idx_filtered = time_filtered_df.index[time_filtered_df['id'] == article_id].tolist()
    if not idx_filtered:
        return pd.DataFrame()
    idx_filtered = idx_filtered[0]

    # Step 5: Query Nearest Neighbors model (Get More Than Needed)
    distances, indices = nn_filtered.kneighbors(tfidf_filtered[idx_filtered])
    recommended_articles = time_filtered_df.iloc[indices[0][1:top_n * 3]].copy().reset_index(drop = True)

    # Step 6: Apply Political Diversity First
    recommended_articles = enforce_political_diversity(recommended_articles, top_n = top_n, primary_weight = primary_weight)

    # Step 7: Apply Fairness Re-Ranking (Prevent Outlet Dominance)
    recommended_articles = fairness_re_ranking(recommended_articles)

    # Step 8: Final Selection (Pick Top-N)
    recommended_articles = recommended_articles.head(top_n)
    recommended_articles = recommended_articles[['id', 'date_publish', 'headline', 'outlet', 'url', 'political_leaning']]
    
    return recommended_articles