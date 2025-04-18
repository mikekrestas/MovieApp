import React, { useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { getFavorites, getFilms, getWatchlist } from '../services/authService';
import { getRecommendations } from '../services/recommendationService';
import MovieCard from '../components/MovieCard';
import { Movie } from '../types/types';

interface RecommendationsPageProps {
  user: User | null;
}

const RecommendationsPage: React.FC<RecommendationsPageProps> = ({ user }) => {
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [films, setFilms] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (user) {
        const [favoriteMovies, userFilms, watchlistMovies] = await Promise.all([
          getFavorites(user.uid),
          getFilms(user.uid),
          getWatchlist(user.uid)
        ]);
        const favoriteMovieIds = favoriteMovies.map(movie => movie.movie_id);
        const watchedMovieIds = userFilms.map(movie => movie.movie_id);
        const watchlistMovieIds = watchlistMovies.map(movie => movie.movie_id);
        const recommendedMovies = await getRecommendations({
          favorite_movie_ids: favoriteMovieIds,
          watched_movie_ids: watchedMovieIds,
          watchlist_movie_ids: watchlistMovieIds
        }, 18);
        setRecommendations(recommendedMovies);
        setFilms(userFilms);
      }
    };
    fetchRecommendations();
  }, [user]);

  const movieCardStyle: React.CSSProperties = {
    width: '200px',
    height: '300px',
    borderRadius: '10px',
    transition: 'transform 0.3s ease, border-color 0.3s ease',
    display: 'block',
    margin: '0 auto',
    position: 'relative',
    top: '0',
  };

  const isInFilms = (movieId: string) => {
    return films.some(film => film.movie_id === movieId);
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-950 to-gray-800 min-h-screen pt-24 flex flex-col items-center">
      <h1 className="my-5 text-4xl font-bold text-white drop-shadow-lg">Recommended Movies</h1>
      {recommendations.length === 0 ? (
        <p className="text-center text-xl text-gray-300">No recommendations available.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {recommendations.map((movie) => (
            <MovieCard key={movie.movie_id} movie={movie} style={{}} isInFilms={isInFilms(movie.movie_id)} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RecommendationsPage;