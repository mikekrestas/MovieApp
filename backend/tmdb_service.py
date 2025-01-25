import requests

TMDB_API_KEY = 'd6c184f394c5630668e1782d6be5afa4'
TMDB_BASE_URL = 'https://api.themoviedb.org/3'

def fetch_movie_details(movie_id):
    url = f"{TMDB_BASE_URL}/movie/{movie_id}"
    params = {
        'api_key': TMDB_API_KEY,
        'language': 'en-US',
    }
    response = requests.get(url, params=params)
    return response.json()

def fetch_similar_movies(movie_id):
    url = f"{TMDB_BASE_URL}/movie/{movie_id}/similar"
    params = {
        'api_key': TMDB_API_KEY,
        'language': 'en-US',
        'page': 1,
    }
    response = requests.get(url, params=params)
    return response.json().get('results', [])