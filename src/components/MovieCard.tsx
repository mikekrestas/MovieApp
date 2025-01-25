// src/components/MovieCard.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Movie } from '../types/types';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/global.css'; // Ensure global styles are imported

interface MovieCardProps {
  movie: Movie;
  isInFilms: boolean;
  style?: React.CSSProperties;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, isInFilms, style }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/movie/${movie.movie_id}`);
  };

  return (
    <div
      className={`card mb-4 ${isInFilms ? 'in-films' : ''}`}
      style={{
        cursor: 'pointer',
        backgroundColor: '#1c1c1c', // Set background color to match app's dark grey background
        borderRadius: '10px',
        transition: 'transform 0.3s ease, border-color 0.3s ease',
        ...style,
      }}
      onClick={handleCardClick}
    >
      <img
        src={movie.posterPath || 'https://via.placeholder.com/200x300'}
        alt={movie.title}
        className={`card-img-top movie-poster ${isInFilms ? 'in-films' : ''}`}
        style={{ height: '300px', objectFit: 'cover', borderRadius: '10px' }}
      />
    </div>
  );
};

export default MovieCard;
