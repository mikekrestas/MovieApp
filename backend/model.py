import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
from tmdb_service import fetch_movie_details, fetch_similar_movies
import logging

def recommend_movies(favorite_movie_ids, num_recommendations=5):
    """
    Recommend movies based on a list of favorite movie IDs using cosine similarity on movie descriptions.
    """
    try:
        # Fetch movie details for favorite movies
        favorite_movies = [fetch_movie_details(movie_id) for movie_id in favorite_movie_ids]
        favorite_descriptions = [movie['overview'] for movie in favorite_movies if 'overview' in movie]

        logging.debug(f"Favorite movies: {favorite_movies}")
        logging.debug(f"Favorite descriptions: {favorite_descriptions}")

        if not favorite_descriptions:
            logging.debug("No favorite movies found in the dataset.")
            return []

        # Create a TF-IDF Vectorizer to transform the text data
        tfidf = TfidfVectorizer(stop_words='english')
        tfidf_matrix = tfidf.fit_transform(favorite_descriptions)

        # Compute the mean vector for the favorite movies
        favorite_tfidf = tfidf_matrix.mean(axis=0)

        # Fetch similar movies for each favorite movie
        similar_movies = []
        for movie_id in favorite_movie_ids:
            similar_movies.extend(fetch_similar_movies(movie_id))

        logging.debug(f"Similar movies: {similar_movies}")

        # Remove duplicates and favorite movies from similar movies
        similar_movies = {movie['id']: movie for movie in similar_movies if movie['id'] not in favorite_movie_ids}.values()

        # Compute similarity scores between the mean vector and all similar movie descriptions
        similar_descriptions = [movie['overview'] for movie in similar_movies if 'overview' in movie]
        if not similar_descriptions:
            logging.debug("No similar movies found.")
            return []

        similar_tfidf_matrix = tfidf.transform(similar_descriptions)
        favorite_tfidf = np.asarray(favorite_tfidf).reshape(1, -1)  # Reshape to 2D array

        logging.debug(f"Favorite TF-IDF shape: {favorite_tfidf.shape}")
        logging.debug(f"Similar TF-IDF matrix shape: {similar_tfidf_matrix.shape}")

        if similar_tfidf_matrix.shape[0] == 0:
            logging.debug("Similar TF-IDF matrix is empty.")
            return []

        cosine_sim = linear_kernel(favorite_tfidf, similar_tfidf_matrix).flatten()

        # Get indices of top recommendations based on similarity scores
        top_indices = cosine_sim.argsort()[-num_recommendations:][::-1]
        top_recommendations = [list(similar_movies)[i] for i in top_indices]

        # Map the recommendations to the expected format
        recommendations = [{
            'movie_id': movie['id'],
            'title': movie['title'],
            'description': movie['overview'],
            'releaseDate': movie['release_date'],
            'posterPath': f"https://image.tmdb.org/t/p/w500{movie['poster_path']}" if movie['poster_path'] else 'https://via.placeholder.com/200x300',
            'director': '',  # Add director if available
            'actors': '',  # Add actors if available
            'genre': '',  # Add genre if available
            'imdbRating': '',  # Add IMDb rating if available
            'language': movie['original_language'],
            'production': '',  # Add production if available
            'runtime': '',  # Add runtime if available
        } for movie in top_recommendations]

        logging.debug(f"Recommendations: {recommendations}")

        return recommendations
    except Exception as e:
        logging.error(f"Error in recommend_movies: {e}")
        raise

# Example usage for testing
if __name__ == "__main__":
    favorite_movie_ids = [1, 2, 3]  # Replace with actual favorite movie IDs
    recommendations = recommend_movies(favorite_movie_ids)
    for rec in recommendations:
        print(f"Title: {rec['title']}, Description: {rec['description']}, Release Date: {rec['releaseDate']}, IMDb Rating: {rec['imdbRating']}")
