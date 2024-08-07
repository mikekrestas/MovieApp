// src/components/MovieDetail.tsx
import React from 'react';
import { Movie } from '../types';
import { addFavorite, removeFavorite } from '../services/authService';
import { User } from 'firebase/auth';

interface MovieDetailProps {
  movie: Movie;
  user: User | null;
  favorites: Movie[];
  setFavorites: React.Dispatch<React.SetStateAction<Movie[]>>;
}

const MovieDetail: React.FC<MovieDetailProps> = ({ movie, user, favorites, setFavorites }) => {
  const isFavorite = favorites.some(fav => fav.id === movie.id);

  const handleFavorite = async () => {
    if (user) {
      if (isFavorite) {
        await removeFavorite(user.uid, movie.id);
        setFavorites(favorites.filter(fav => fav.id !== movie.id));
      } else {
        await addFavorite(user.uid, movie);
        setFavorites([...favorites, movie]);
      }
    } else {
      // Handle case where user is not logged in
      console.log('User is not logged in');
    }
  };

  return (
    <div>
      <h1>{movie.title}</h1>
      <p>{movie.description}</p>
      <button onClick={handleFavorite}>
        {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
      </button>
    </div>
  );
};

export default MovieDetail;
