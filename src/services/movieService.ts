// src/services/movieService.ts
import axios from 'axios';
import { Movie } from '../types/types';

const TMDB_API_KEY = 'd6c184f394c5630668e1782d6be5afa4';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Transform the TMDB API movie response into your Movie type
const transformApiMovie = (tmdbMovie: any): Movie => ({
  movie_id: tmdbMovie.id.toString(),
  title: tmdbMovie.title || 'No Title',
  description: tmdbMovie.overview || 'No Description',
  releaseDate: tmdbMovie.release_date || 'Unknown Release Date',
  posterPath: `https://image.tmdb.org/t/p/w500${tmdbMovie.poster_path}` || 'No Poster',
  genre: tmdbMovie.genre_ids.join(', ') || 'No Genre',
  director: '', // TMDB doesn't provide director info in this endpoint
  actors: '', // No actor info available in this endpoint
  runtime: '', // Runtime info is not available in this endpoint
  imdbRating: tmdbMovie.vote_average.toString() || 'No IMDb Rating',
  language: tmdbMovie.original_language || 'No Language',
  production: '', // Not available in the now playing endpoint
});

// Fetch latest movies currently playing in cinemas
export const fetchLatestMovies = async (): Promise<Movie[]> => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/now_playing`, {
      params: {
        api_key: TMDB_API_KEY,
        language: 'en-US', // Fetch English movies, you can change as needed
        page: 1, // Pagination: fetch the first page of results
      },
    });

    const movies = response.data.results.map(transformApiMovie);
    return movies;
  } catch (error) {
    console.error('Error fetching latest movies from TMDB:', error);
    throw error;
  }
};

// Other functions like searchMovies can go here...

export const searchMovies = async (query: string): Promise<Movie[]> => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
      params: {
        api_key: TMDB_API_KEY,
        query: query,
      },
    });

    const movies = response.data.results.map(transformApiMovie);
    return movies;
  } catch (error) {
    console.error('Error searching movies from TMDB:', error);
    throw error;
  }
};


