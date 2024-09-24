import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel

# Load movie data
movies_df = pd.read_csv('data/movies.csv')

# Create a TF-IDF Vectorizer to transform the text data
tfidf = TfidfVectorizer(stop_words='english')
movies_df['description'] = movies_df['description'].fillna('')  # Fill missing descriptions with an empty string
tfidf_matrix = tfidf.fit_transform(movies_df['description'])

def recommend_movies(query, num_recommendations=5):
    """
    Recommend movies based on a query using cosine similarity on movie descriptions.
    """
    # Transform the query using the same vectorizer
    query_tfidf = tfidf.transform([query])
    # Compute similarity scores between the query and the movie descriptions
    cosine_sim = linear_kernel(query_tfidf, tfidf_matrix).flatten()
    # Get indices of top recommendations based on similarity scores
    top_indices = cosine_sim.argsort()[-num_recommendations:][::-1]
    return movies_df.iloc[top_indices]

# Example usage for testing
if __name__ == "__main__":
    query = "dark thriller drama movie after 2000 by Christopher Nolan"
    recommendations = recommend_movies(query)
    print(recommendations[['title', 'description', 'releaseDate', 'imdbRating']])
