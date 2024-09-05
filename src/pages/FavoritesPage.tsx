import React from 'react';
import { Movie } from '../types/types';
import MovieCard from '../components/MovieCard';
import { User } from 'firebase/auth';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../index.css';

interface FavoritesPageProps {
  user: User | null;
  favorites: Movie[];
  setFavorites: (movies: Movie[]) => void;
}

const FavoritesPage: React.FC<FavoritesPageProps> = ({ user, favorites, setFavorites }) => {
  return (
    <div className="bg-dark text-white min-vh-100 d-flex flex-column align-items-center">
      <h3 className="my-2"> </h3>
      <h1 className="my-5">Favourites</h1>
      <div className="container">
        {favorites.length === 0 ? (
          <p className="text-center" style={{ fontSize: '1.5rem' }}>You have no favorite movies yet.</p>
        ) : (
          <div className="row">
            {favorites.map((movie) => (
              <div key={movie.id} className="col-sm-6 col-md-4 col-lg-3 mb-4">
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
