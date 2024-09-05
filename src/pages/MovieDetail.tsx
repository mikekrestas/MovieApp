import React from 'react';
import { Movie } from '../types/types';
import { addFavorite, removeFavorite } from '../services/authService';
import { User } from 'firebase/auth';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported

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
    <div className="container my-5">
      <div className="row">
        <div className="col-md-4">
          <img
            src={movie.posterPath || 'https://via.placeholder.com/300x450'}
            alt={movie.title}
            className="img-fluid"
          />
        </div>
        <div className="col-md-8">
          <h1 className="mb-4">{movie.title}</h1>
          <p className="mb-4">{movie.description}</p>
          <button
            onClick={handleFavorite}
            className={`btn ${isFavorite ? 'btn-danger' : 'btn-primary'}`}
          >
            {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
