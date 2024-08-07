// src/pages/FavoritesPage.tsx
import React from 'react';
import { Movie } from '../types';
import { User } from 'firebase/auth';

interface FavoritesPageProps {
  user: User | null;
  favorites: Movie[];
  setFavorites: React.Dispatch<React.SetStateAction<Movie[]>>;
}

const FavoritesPage: React.FC<FavoritesPageProps> = ({ favorites }) => {
  return (
    <div>
      <h1>My Favorites</h1>
      {favorites.length > 0 ? (
        <ul>
          {favorites.map((movie) => (
            <li key={movie.id}>
              <h2>{movie.title}</h2>
              <p>{movie.description}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No favorite movies found.</p>
      )}
    </div>
  );
};

export default FavoritesPage;
