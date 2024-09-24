from flask import Flask, request, jsonify
import requests
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.tokenize import regexp_tokenize

app = Flask(__name__)

OMDB_API_KEY = '88e8fc3'
OMDB_API_URL = 'http://www.omdbapi.com/'

# Download necessary NLTK data
import nltk
nltk.download('stopwords')
nltk.download('punkt')
nltk.download('punkt_tab')
nltk.download('punkt', download_dir='path/to/nltk_data')

# Initialize stopwords and tokenizer
stop_words = set(stopwords.words('english'))
tokenizer = nltk.tokenize.RegexpTokenizer(r'\w+')

def simple_tokenize(text):
    # Tokenize and remove stopwords
    tokens = tokenizer.tokenize(text.lower())
    return tokens

def process_query(query):
    # Tokenize the query
    tokens = simple_tokenize(query)
    filtered_tokens = [word for word in tokens if word not in stop_words]
    
    # Construct search term from filtered tokens
    search_term = ' '.join(filtered_tokens)
    print(f"Processed search term: {search_term}")  # Debugging line

    # Create search parameters for OMDb API
    search_params = {
        's': search_term,
        'apikey': OMDB_API_KEY
    }
    return search_params

@app.route('/top_movies', methods=['GET'])
def top_movies():
    query = request.args.get('query', '')
    print(f"Original query: {query}")  # Debugging line

    # Process the query to create search parameters
    search_params = process_query(query)
    print(f"Search parameters: {search_params}")  # Debugging line

    # Perform the API request
    response = requests.get(OMDB_API_URL, params=search_params)
    data = response.json()

    # Check for errors and format response
    if 'Error' in data:
        return jsonify({'error': data['Error']}), 404

    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)