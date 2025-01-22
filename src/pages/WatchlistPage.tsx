// src/pages/WatchlistPage.tsx
import React, { useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { getWatchlist } from '../services/authService';
import MovieCard from '../components/MovieCard';
import { Movie } from '../types/types';

interface WatchlistPageProps {
  user: User | null;
}

const WatchlistPage: React.FC<WatchlistPageProps> = ({ user }) => {
  const [watchlist, setWatchlist] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchWatchlist = async () => {
      if (user) {
        const movies = await getWatchlist(user.uid);
        setWatchlist(movies);
      }
    };
    fetchWatchlist();
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

  return (
    <div className="bg-dark text-white min-vh-100 d-flex flex-column align-items-center">
      <h3 className="my-2"> </h3>
      <h1 className="my-5">Watchlist</h1>
      <div className="container">
        {watchlist.length === 0 ? (
          <p className="text-center" style={{ fontSize: '1.5rem' }}>Your watchlist is empty.</p>
        ) : (
          <div className="row">
            {watchlist.map((movie) => (
              <div key={movie.movie_id} className="col-6 col-sm-4 col-md-3 col-lg-2 mb-4">
                <MovieCard movie={movie} style={movieCardStyle} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchlistPage;
