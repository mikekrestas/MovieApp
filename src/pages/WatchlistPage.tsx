// src/pages/WatchlistPage.tsx
import React, { useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { getWatchlist, getFilms } from '../services/authService';
import MovieCard from '../components/MovieCard';
import { Movie } from '../types/types';

interface WatchlistPageProps {
  user: User | null;
}

const WatchlistPage: React.FC<WatchlistPageProps> = ({ user }) => {
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const [films, setFilms] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchWatchlist = async () => {
      if (user) {
        const movies = await getWatchlist(user.uid);
        setWatchlist(movies);
        const films = await getFilms(user.uid);
        setFilms(films);
      }
    };
    fetchWatchlist();
  }, [user]);

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-950 to-gray-800 min-h-screen pt-24 flex flex-col items-center">
      <h3 className="my-2"></h3>
      <h1 className="my-5 text-4xl font-bold text-white drop-shadow-lg">Watchlist</h1>
      {watchlist.length === 0 ? (
        <p className="text-center text-xl text-gray-300">Your watchlist is empty.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {watchlist.map((movie) => (
            <MovieCard key={movie.movie_id} movie={movie} style={{}} isInFilms={films.some(film => film.movie_id === movie.movie_id)} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WatchlistPage;
