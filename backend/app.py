import os
import requests
from flask import Flask, request, jsonify
from transformers import pipeline

app = Flask(__name__)

# Load GPT-2 model for text generation
generator = pipeline('text-generation', model='gpt2')

# Replace this with your OMDb API key, preferably from an environment variable
OMDB_API_KEY = os.getenv('OMDB_API_KEY', '88e8fc3')

def fetch_movie_from_omdb(query):
    """
    Fetch movie details from OMDb API based on a search query.
    """
    url = f"http://www.omdbapi.com/?apikey={OMDB_API_KEY}&s={query}&type=movie"
    response = requests.get(url)
    data = response.json()
    
    if data['Response'] == 'True':
        movies = data['Search']
        detailed_movies = []

        for movie in movies:
            movie_details = fetch_detailed_movie_info(movie['imdbID'])
            if movie_details:
                detailed_movies.append(movie_details)
        
        unique_movies = {movie['imdbID']: movie for movie in detailed_movies}
        return list(unique_movies.values())
    else:
        return []

def fetch_detailed_movie_info(imdb_id):
    """
    Fetch detailed movie information using IMDb ID.
    """
    url = f"http://www.omdbapi.com/?apikey={OMDB_API_KEY}&i={imdb_id}&plot=full"
    response = requests.get(url)
    return response.json()

def generate_response(query):
    """
    Use GPT-2 to generate a response for more complex queries.
    """
    result = generator(query, max_length=50, num_return_sequences=1)
    return result[0]['generated_text']

@app.route('/')
def home():
    return 'Welcome to the Movie App!'

@app.route('/favicon.ico')
def favicon():
    return '', 204  # No content for favicon

@app.route('/recommend', methods=['GET'])
def recommend_movies():
    """
    Recommend movies based on a user query.
    """
    query = request.args.get('query')
    print(f"Received query: {query}")  # Debug print
    if not query:
        return jsonify({'error': 'Query parameter is required'}), 400

    # Generate a more detailed response if needed
    if 'first movie' in query.lower():
        # Example specific handling, you can add more conditions
        response_text = generate_response(query)
        return jsonify({'response': response_text})

    # Try to fetch movies from OMDb
    movies = fetch_movie_from_omdb(query)
    print(f"Movies found: {movies}")  # Debug print
    if movies:
        return jsonify(movies)
    
    return jsonify({'error': 'No movies found for your query'}), 404

if __name__ == '__main__':
    app.run(debug=True)
