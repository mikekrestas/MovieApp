import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Movie } from '../types';

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  const cardStyle = {
    border: '1px solid #ddd',
    borderRadius: '8px',
    overflow: 'hidden',
    width: '200px',
    margin: '16px',
    cursor: 'pointer',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    textAlign: 'center' as 'center',
  };

  const imgStyle = {
    width: '100%',
    height: '300px',
    objectFit: 'cover' as 'cover',
  };

  const titleStyle = {
    fontSize: '16px',
    fontWeight: 'bold' as 'bold',
    margin: '8px 0',
  };

  return (
    <div style={cardStyle} onClick={handleCardClick}>
      <img src={movie.posterPath} alt={movie.title} style={imgStyle} />
      <div style={titleStyle}>{movie.title}</div>
    </div>
  );
};

export default MovieCard;
