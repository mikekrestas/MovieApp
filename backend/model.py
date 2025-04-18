import requests
import logging
import os
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
import pandas as pd
import numpy as np

OMDB_API_KEY = '88e8fc3'  # Use your OMDb API key here
OMDB_BASE_URL = 'http://www.omdbapi.com/'

def fetch_movie_details_omdb(imdb_id):
    params = {
        'i': imdb_id,
        'apikey': OMDB_API_KEY
    }
    response = requests.get(OMDB_BASE_URL, params=params)
    return response.json() if response.status_code == 200 else None

def fetch_similar_movies_omdb(base_movie, all_movies, exclude_ids):
    # Use genre, director, and actors to find similar movies
    base_genres = set(base_movie.get('Genre', '').split(', '))
    base_director = base_movie.get('Director', '')
    base_actors = set(base_movie.get('Actors', '').split(', '))
    similar = []
    for movie in all_movies:
        if movie['imdbID'] in exclude_ids or movie['imdbID'] == base_movie['imdbID']:
            continue
        genres = set(movie.get('Genre', '').split(', '))
        actors = set(movie.get('Actors', '').split(', '))
        director = movie.get('Director', '')
        # Simple similarity: overlap in genre, director, or actors
        score = len(base_genres & genres)
        if director == base_director and director:
            score += 2
        score += len(base_actors & actors)
        if score > 0:
            similar.append((score, movie))
    # Sort by score descending
    similar.sort(reverse=True, key=lambda x: x[0])
    return [m for _, m in similar]

def load_imdb_id_pool_from_csv(path='data/TMDB_movie_dataset_v11.csv'):
    # Only load the imdb_id column for efficiency
    df = pd.read_csv(path, usecols=['imdb_id'])
    # Drop NaN and duplicates, and ensure string type
    imdb_ids = df['imdb_id'].dropna().astype(str).unique().tolist()
    # Remove empty or malformed IDs
    imdb_ids = [i for i in imdb_ids if i.startswith('tt')]
    return imdb_ids

IMDB_ID_POOL = load_imdb_id_pool_from_csv()

def get_movie_pool():
    # Only fetch a small sample for performance (e.g., 100 movies)
    # In production, you should cache results or pre-fetch details
    movies = []
    count = 0
    for imdb_id in IMDB_ID_POOL:
        if count >= 100:
            break
        m = fetch_movie_details_omdb(imdb_id)
        if m and m.get('Response') == 'True':
            movies.append(m)
            count += 1
    return movies

def recommend_movies(favorite_movie_ids, exclude_movie_ids=None, num_recommendations=5):
    if exclude_movie_ids is None:
        exclude_movie_ids = set()
    try:
        favorite_movies = [fetch_movie_details_omdb(mid) for mid in favorite_movie_ids]
        favorite_movies = [m for m in favorite_movies if m and m.get('Response') == 'True']
        if not favorite_movies:
            logging.debug('No valid favorite movies found.')
            # Fallback: recommend random unseen movies from the pool
            all_movies = get_movie_pool()
            unseen = [movie for movie in all_movies if movie['imdbID'] not in exclude_movie_ids]
            recommendations = []
            for movie in unseen:
                recommendations.append({
                    'movie_id': movie['imdbID'],
                    'title': movie.get('Title', ''),
                    'description': movie.get('Plot', ''),
                    'releaseDate': movie.get('Released', ''),
                    'posterPath': movie.get('Poster', ''),
                    'director': movie.get('Director', ''),
                    'actors': movie.get('Actors', ''),
                    'genre': movie.get('Genre', ''),
                    'imdbRating': movie.get('imdbRating', ''),
                    'language': movie.get('Language', ''),
                    'production': movie.get('Production', ''),
                    'runtime': movie.get('Runtime', ''),
                    'boxOffice': movie.get('BoxOffice', ''),
                    'country': movie.get('Country', ''),
                })
                if len(recommendations) >= num_recommendations:
                    break
            return recommendations
        # For demo: fetch a pool of movies (could be from a local CSV or a pre-fetched OMDb list)
        # Here, let's just use the favorites as the pool for simplicity
        all_movies = get_movie_pool()
        # In a real app, you should have a larger pool (e.g., from a CSV or OMDb search)
        # For each favorite, find similar movies
        similar_movies = []
        for fav in favorite_movies:
            similar_movies.extend(fetch_similar_movies_omdb(fav, all_movies, exclude_movie_ids))
        # Remove duplicates and already seen
        seen = set()
        recommendations = []
        for movie in similar_movies:
            imdb_id = movie['imdbID']
            if imdb_id not in seen and imdb_id not in exclude_movie_ids:
                seen.add(imdb_id)
                recommendations.append({
                    'movie_id': imdb_id,
                    'title': movie.get('Title', ''),
                    'description': movie.get('Plot', ''),
                    'releaseDate': movie.get('Released', ''),
                    'posterPath': movie.get('Poster', ''),
                    'director': movie.get('Director', ''),
                    'actors': movie.get('Actors', ''),
                    'genre': movie.get('Genre', ''),
                    'imdbRating': movie.get('imdbRating', ''),
                    'language': movie.get('Language', ''),
                    'production': movie.get('Production', ''),
                    'runtime': movie.get('Runtime', ''),
                    'boxOffice': movie.get('BoxOffice', ''),
                    'country': movie.get('Country', ''),
                })
                if len(recommendations) >= num_recommendations:
                    break
        # Fallback: if still no recommendations, return random unseen
        if not recommendations:
            unseen = [movie for movie in all_movies if movie['imdbID'] not in exclude_movie_ids]
            for movie in unseen:
                recommendations.append({
                    'movie_id': movie['imdbID'],
                    'title': movie.get('Title', ''),
                    'description': movie.get('Plot', ''),
                    'releaseDate': movie.get('Released', ''),
                    'posterPath': movie.get('Poster', ''),
                    'director': movie.get('Director', ''),
                    'actors': movie.get('Actors', ''),
                    'genre': movie.get('Genre', ''),
                    'imdbRating': movie.get('imdbRating', ''),
                    'language': movie.get('Language', ''),
                    'production': movie.get('Production', ''),
                    'runtime': movie.get('Runtime', ''),
                    'boxOffice': movie.get('BoxOffice', ''),
                    'country': movie.get('Country', ''),
                })
                if len(recommendations) >= num_recommendations:
                    break
        return recommendations
    except Exception as e:
        logging.error(f'Error in recommend_movies: {e}')
        return []
