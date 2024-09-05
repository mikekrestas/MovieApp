import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Movie } from '../types/types';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  return (
    <div className="card mb-4" style={{ cursor: 'pointer' }} onClick={handleCardClick}>
      <img
        src={movie.posterPath || 'https://via.placeholder.com/200x300'}
        alt={movie.title}
        className="card-img-top"
        style={{ height: '300px', objectFit: 'cover' }}
      />
      <div className="card-body text-center">
        {/* <h5 className="card-title">{movie.title}</h5> */}
      </div>
    </div>
  );
};

export default MovieCard;
