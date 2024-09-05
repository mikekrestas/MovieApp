import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel

# Load movie data
movies_df = pd.read_csv('data/movies.csv') 

# Create a TF-IDF Vectorizer to transform the text data
tfidf = TfidfVectorizer(stop_words='english')
movies_df['description'] = movies_df['description'].fillna('')
tfidf_matrix = tfidf.fit_transform(movies_df['description'])

def recommend_movies(query, num_recommendations=5):
    # Transform the query using the same vectorizer
    query_tfidf = tfidf.transform([query])
    # Compute similarity scores
    cosine_sim = linear_kernel(query_tfidf, tfidf_matrix).flatten()
    # Get indices of top recommendations
    top_indices = cosine_sim.argsort()[-num_recommendations:][::-1]
    return movies_df.iloc[top_indices]

# Example usage
if __name__ == "__main__":
    query = "dark thriller drama movie after 2000 by Christopher Nolan"
    recommendations = recommend_movies(query)
    print(recommendations[['title', 'description', 'releaseDate', 'imdbRating']])
