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
  films: Movie[];
}

const FavoritesPage: React.FC<FavoritesPageProps> = ({ user, favorites, setFavorites, films }) => {
  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-950 to-gray-800 min-h-screen pt-24 flex flex-col items-center">
      <h3 className="my-2"></h3>
      <h1 className="my-5 text-4xl font-bold text-white drop-shadow-lg">Favourites</h1>
      {favorites.length === 0 ? (
        <p className="text-center text-xl text-gray-300">You have no favorite movies yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {favorites.map((movie) => (
            <MovieCard key={movie.movie_id} movie={movie} style={{}} isInFilms={films.some(film => film.movie_id === movie.movie_id)} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
