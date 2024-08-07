// src/services/movieService.ts
import axios from 'axios';
import { Movie } from '../types';

const API_KEY = '88e8fc3';
const BASE_URL = 'http://www.omdbapi.com/';

interface ApiMovie {
  imdbID: string;
  Title: string;
  Plot: string;
  Released: string;
  Poster: string;
}

const transformApiMovie = (apiMovie: ApiMovie): Movie => ({
  id: apiMovie.imdbID || '',
  title: apiMovie.Title || 'No Title',
  description: apiMovie.Plot || 'No Description',
  releaseDate: apiMovie.Released || 'Unknown Release Date',
  posterPath: apiMovie.Poster || 'No Poster',
});

export const getMovies = async (): Promise<Movie[]> => {
  const response = await axios.get(BASE_URL);
  return response.data.map((apiMovie: any) => ({
    id: apiMovie.id,
    title: apiMovie.title,
    description: apiMovie.description,
    releaseDate: apiMovie.releaseDate,
    posterPath: apiMovie.posterPath,
  }));
};

export const fetchMovies = async (): Promise<Movie[]> => {
  try {
    const response = await axios.get<{ Search: ApiMovie[] }>(BASE_URL, {
      params: {
        apikey: API_KEY,
        s: 'Avengers', // Change to a known title to ensure results
      },
    });

    if (response.data.Search) {
      return response.data.Search.map(transformApiMovie);
    } else {
      throw new Error('No movies found');
    }
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
};

export const fetchMovieDetails = async (id: string): Promise<Movie> => {
  try {
    const response = await axios.get<ApiMovie>(BASE_URL, {
      params: {
        apikey: API_KEY,
        i: id,
      },
    });

    return transformApiMovie(response.data);
  } catch (error) {
    console.error(`Error fetching details for movie ID ${id}:`, error);
    throw error;
  }
};

export const searchMovies = async (query: string): Promise<Movie[]> => {
  try {
    const response = await axios.get<{ Search: ApiMovie[] }>(BASE_URL, {
      params: {
        apikey: API_KEY,
        s: query,
      },
    });

    if (response.data.Search) {
      return response.data.Search.map(transformApiMovie);
    } else {
      throw new Error('No search results found');
    }
  } catch (error) {
    console.error(`Error searching for movies with query "${query}":`, error);
    throw error;
  }
};
