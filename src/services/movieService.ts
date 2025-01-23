// src/services/movieService.ts
import axios from 'axios';
import { Movie } from '../types/types';

const TMDB_API_KEY = 'd6c184f394c5630668e1782d6be5afa4';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const genreMap: { [key: number]: string } = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Science Fiction',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
};

// Transform the TMDB API movie response into your Movie type
const transformApiMovie = (tmdbMovie: any): Movie => ({
  movie_id: tmdbMovie.id.toString(),
  title: tmdbMovie.title || 'No Title',
  description: tmdbMovie.overview || 'No Description',
  releaseDate: tmdbMovie.release_date || 'Unknown Release Date',
  posterPath: `https://image.tmdb.org/t/p/w500${tmdbMovie.poster_path}` || 'No Poster',
  genre: tmdbMovie.genres.map((genre: any) => genre.name).join(', ') || 'No Genre',
  director: tmdbMovie.credits.crew.find((member: any) => member.job === 'Director')?.name || 'No Director',
  actors: tmdbMovie.credits.cast.slice(0, 5).map((actor: any) => actor.name).join(', ') || 'No Actors',
  imdbRating: tmdbMovie.vote_average ? tmdbMovie.vote_average.toFixed(1) : 'No IMDb Rating',
  language: tmdbMovie.original_language || 'No Language',
  production: tmdbMovie.production_companies.map((company: any) => company.name).join(', ') || 'No Production',
  runtime: tmdbMovie.runtime ? `${tmdbMovie.runtime} min` : 'No Runtime',
  boxOffice: tmdbMovie.revenue ? `$${tmdbMovie.revenue.toLocaleString()}` : 'No Box Office Data',
});

// Fetch latest movies currently playing in cinemas
export const fetchMovieDetails = async (movieId: string): Promise<Movie> => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}`, {
      params: {
        api_key: TMDB_API_KEY,
        language: 'en-US',
        append_to_response: 'credits',
      },
    });

    const movie = transformApiMovie(response.data);
    return movie;
  } catch (error) {
    console.error('Error fetching movie details from TMDB:', error);
    throw error;
  }
};

// Fetch latest movies currently playing in cinemas
export const fetchLatestMovies = async (): Promise<Movie[]> => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/now_playing`, {
      params: {
        api_key: TMDB_API_KEY,
        language: 'en-US',
        page: 1,
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
