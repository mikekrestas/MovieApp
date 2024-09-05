# backend/utils.py

import pandas as pd

def load_movie_data(file_path):
    # Load and preprocess movie data
    df = pd.read_csv(file_path)
    # Example preprocessing (you can expand on this)
    df['Plot'] = df['Plot'].fillna('')
    return df
