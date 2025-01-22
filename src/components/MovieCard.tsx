// src/components/MovieCard.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Movie } from '../types/types';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported

interface MovieCardProps {
  movie: Movie;
  style?: React.CSSProperties;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, style }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/movie/${movie.movie_id}`);
  };

  return (
    <div className="card mb-4" style={{ cursor: 'pointer', ...style }} onClick={handleCardClick}>
      <img
        src={movie.posterPath || 'https://via.placeholder.com/200x300'}
        alt={movie.title}
        className="card-img-top movie-poster"  // Apply the movie-poster class here
        style={{ height: '300px', objectFit: 'cover' }}  // Keep your existing style
      />
    </div>
  );
};

export default MovieCard;
