import React from 'react';
import { Movie } from '../types';
import MovieCard from '../components/MovieCard';
import { User } from 'firebase/auth';

interface FavoritesPageProps {
  user: User | null;
  favorites: Movie[];
  setFavorites: (movies: Movie[]) => void;
}

const FavoritesPage: React.FC<FavoritesPageProps> = ({ user, favorites, setFavorites }) => {
  return (
    <div style={pageStyle}>
      <h1 style={titleStyle}>Favorites</h1>
      <div style={gridStyle}>
        {favorites.length === 0 ? (
          <p style={{ fontSize: '1.5rem' }}>You have no favorite movies yet.</p>
        ) : (
          favorites.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))
        )}
      </div>
    </div>
  );
};

const pageStyle = {
  padding: '20px',
  display: 'flex',
  flexDirection: 'column' as 'column',
  alignItems: 'center' as 'center',
};

const titleStyle = {
  fontSize: '2rem',
  marginBottom: '20px',
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '16px',
  width: '100%',
  maxWidth: '1200px',
};

export default FavoritesPage;
