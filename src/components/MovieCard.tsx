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

  const cardStyle: React.CSSProperties = {
    border: '1px solid #ddd',
    borderRadius: '8px',
    overflow: 'hidden',
    width: '200px',
    margin: '16px',
    cursor: 'pointer',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    textAlign: 'center',
    backgroundColor: '#fff',
  };

  const imgStyle: React.CSSProperties = {
    width: '100%',
    height: '300px',
    objectFit: 'cover',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: 'bold',
    margin: '8px 0',
    color: '#333',
  };

  return (
    <div style={cardStyle} onClick={handleCardClick}>
      <img src={movie.posterPath || 'https://via.placeholder.com/200x300'} alt={movie.title} style={imgStyle} />
      <div style={titleStyle}>{movie.title}</div>
    </div>
  );
};

export default MovieCard;
