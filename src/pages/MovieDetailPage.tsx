import React from 'react';
import { useParams } from 'react-router-dom';
import { Movie } from '../types';
import { addFavorite, removeFavorite } from '../services/authService';
import { User } from 'firebase/auth';

interface MovieDetailPageProps {
  user: User | null;
  favorites: Movie[];
  setFavorites: (movies: Movie[]) => void;
  movies: Movie[];
}

const MovieDetailPage: React.FC<MovieDetailPageProps> = ({ user, favorites, setFavorites, movies }) => {
  const { id } = useParams<{ id: string }>();
  const movie = movies.find(movie => movie.id === id);

  if (!movie) {
    return <div>Movie not found</div>;
  }

  const isFavorite = favorites.some(favorite => favorite.id === movie.id);

  const handleFavorite = async () => {
    if (!user) {
      alert("Please log in to add favorites");
      return;
    }

    if (isFavorite) {
      await removeFavorite(user.uid, movie.id);
      setFavorites(favorites.filter(fav => fav.id !== movie.id));
    } else {
      await addFavorite(user.uid, movie);
      setFavorites([...favorites, movie]);
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

export default MovieDetailPage;
