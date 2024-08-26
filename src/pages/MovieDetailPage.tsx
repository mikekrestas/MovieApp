import React from 'react';
import { useParams } from 'react-router-dom';
import { Movie } from '../types';
import { addFavorite, removeFavorite } from '../services/authService';
import { User } from 'firebase/auth';
import { CSSProperties } from 'react';

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
    return <div style={notFoundStyle}>Movie not found</div>;
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
    <div style={containerStyle}>
      <div style={movieCardStyle}>
        <h1 style={titleStyle}>{movie.title}</h1>
        <img src={movie.posterPath} alt={movie.title} style={imageStyle} />
        <div style={detailsStyle}>
          <p><strong>Release Date:</strong> {movie.releaseDate}</p>
          <p><strong>Genre:</strong> {movie.genre}</p>
          <p><strong>Director:</strong> {movie.director}</p>
          <p><strong>Actors:</strong> {movie.actors}</p>
          <p><strong>Runtime:</strong> {movie.runtime}</p>
          <p><strong>IMDb Rating:</strong> {movie.imdbRating}</p>
          <p><strong>Plot:</strong> {movie.description}</p>
          <p><strong>Box Office:</strong> {movie.boxOffice}</p>
          <p><strong>Production:</strong> {movie.production}</p>
        </div>
        <button onClick={handleFavorite} style={buttonStyle}>
          {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
        </button>
      </div>
    </div>
  );
};

// Styles

const containerStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  backgroundColor: '#282c34',
  padding: '20px',
  boxSizing: 'border-box', // Ensures padding doesn't cause overflow
};

const movieCardStyle: CSSProperties = {
  backgroundColor: '#1e1e30',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)',
  maxWidth: '90%', // Adjusted to fit within the screen
  width: '600px', // Adjust width to be reasonable for most screens
  textAlign: 'left',
  color: 'white',
  boxSizing: 'border-box', // Ensures padding doesn't cause overflow
  overflow: 'hidden', // Hide any overflow content
};

const titleStyle: CSSProperties = {
  fontSize: '24px',
  marginBottom: '10px',
  color: '#fff',
};

const imageStyle: CSSProperties = {
  width: '100%',
  maxWidth: '400px',
  borderRadius: '8px',
  marginBottom: '20px',
};

const detailsStyle: CSSProperties = {
  marginBottom: '20px',
};

const buttonStyle: CSSProperties = {
  padding: '10px 20px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '16px',
};

// Not found style
const notFoundStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  fontSize: '24px',
  color: '#fff',
};

export default MovieDetailPage;
