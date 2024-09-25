// src/services/tmdbService.ts
import axios from 'axios';
import { Movie } from '../types/types';

const TMDB_API_KEY = 'd6c184f394c5630668e1782d6be5afa4';
const BASE_URL = 'https://api.themoviedb.org/3';

export const fetchNowPlayingMovies = async (): Promise<Movie[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/now_playing`, {
      params: {
        api_key: TMDB_API_KEY,
        language: 'en-US',
        page: 1,
        region: 'US',
      },
    });

    return response.data.results.map((movie: any) => ({
      movie_id: movie.id,  // TMDB uses 'id'
      title: movie.title,
      description: movie.overview,  // 'overview' in TMDB maps to 'description'
      releaseDate: movie.release_date,  // 'release_date' in TMDB maps to 'releaseDate'
      posterPath: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,  // 'poster_path' to 'posterPath'
      director: '',  // TMDB "now playing" API doesn't give director, leave empty
      actors: '',  // Same for actors, you can populate this with another API call
      genre: '',  // You can populate this field using the genres
      imdbRating: '',  // No IMDb rating from TMDB, leave empty or handle later
      language: movie.original_language,  // 'original_language' in TMDB
      production: '',  // TMDB doesn't provide production in this API call
      runtime: '',  // No runtime, this can be fetched in detail API if needed
    }));
  } catch (error) {
    console.error('Error fetching now playing movies:', error);
    throw error;
  }
};
