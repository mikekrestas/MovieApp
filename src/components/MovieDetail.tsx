// src/components/MovieDetail.tsx

import React from 'react';
import { Movie } from '../types/types';

interface MovieDetailProps {
  movie: Movie;
}

const MovieDetail: React.FC<MovieDetailProps> = ({ movie }) => {
  return (
    <div>
      <img src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`} alt={movie.title} />
      <h1>{movie.title}</h1>
      <p>{movie.description}</p>
      <p>Release Date: {movie.releaseDate}</p>
    </div>
  );
};

export default MovieDetail;
