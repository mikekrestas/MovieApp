// src/pages/HomePage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Movie } from '../types';
import { User } from 'firebase/auth';

interface HomePageProps {
  user: User | null;
  favorites: Movie[];
  setFavorites: React.Dispatch<React.SetStateAction<Movie[]>>;
  searchResults: Movie[];
  movies: Movie[];
}

const HomePage: React.FC<HomePageProps> = ({ user, favorites, setFavorites, searchResults, movies }) => {
  console.log('HomePage props:', { user, favorites, searchResults, movies });

  const displayedMovies = searchResults.length > 0 ? searchResults : movies;

  const cardStyle = {
    width: '200px',
    margin: '10px',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    textAlign: 'center' as const,
  };

  const imageStyle = {
    width: '100%',
    height: '300px',
    objectFit: 'cover' as const,
    borderRadius: '5px',
  };

  const linkStyle = {
    textDecoration: 'none',
    color: 'inherit',
  };

  const infoStyle = {
    padding: '10px 0',
  };

  const movieTitleStyle = {
    fontSize: '1.2em',
    margin: '10px 0',
  };

  const movieDescriptionStyle = {
    fontSize: '0.9em',
    color: '#666',
  };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', padding: '20px' }}>
      {displayedMovies.map((movie) => (
        <div key={movie.id} style={cardStyle}>
          <Link to={`/movie/${movie.id}`} style={linkStyle}>
            <img src={movie.posterPath} alt={movie.title} style={imageStyle} />
            <div style={infoStyle}>
              <h3 style={movieTitleStyle}>{movie.title}</h3>
              <p style={movieDescriptionStyle}>{movie.description}</p>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default HomePage;
