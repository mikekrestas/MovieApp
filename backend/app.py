from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
from model import recommend_movies

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

logging.basicConfig(level=logging.DEBUG)

@app.route('/recommend', methods=['POST'])
def recommend():
    try:
        data = request.json
        favorite_movie_ids = data.get('favorite_movie_ids', [])
        watched_movie_ids = data.get('watched_movie_ids', [])
        watchlist_movie_ids = data.get('watchlist_movie_ids', [])
        num_recommendations = data.get('num_recommendations', 5)

        # Combine all excluded movie IDs
        exclude_movie_ids = set(favorite_movie_ids) | set(watched_movie_ids) | set(watchlist_movie_ids)

        print(f"Received favorite_movie_ids: {favorite_movie_ids}")
        print(f"Received watched_movie_ids: {watched_movie_ids}")
        print(f"Received watchlist_movie_ids: {watchlist_movie_ids}")

        recommendations = recommend_movies(
            favorite_movie_ids=favorite_movie_ids,
            exclude_movie_ids=exclude_movie_ids,
            num_recommendations=num_recommendations
        )
        if not recommendations:
            print("No recommendations found.")
            return jsonify([])

        print(f"Recommendations: {recommendations}")
        return jsonify(recommendations), 200
    except Exception as e:
        logging.error(f"Error in /recommend: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)