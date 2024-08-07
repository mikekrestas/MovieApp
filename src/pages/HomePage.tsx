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
    width: '100%',
    maxWidth: '200px',
    margin: '10px',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    textAlign: 'center' as const,
    backgroundColor: 'rgb(40, 44, 52)', // Dark background color
  };

  const imageStyle = {
    width: '100%',
    height: 'auto',
    maxHeight: '300px',
    objectFit: 'cover' as const,
    borderRadius: '8px',
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
    fontWeight: 'bold' as const,
  };

  const movieDescriptionStyle = {
    fontSize: '0.9em',
    color: '#666',
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center' as const,
    padding: '20px',
    backgroundColor: 'rgb(40, 44, 68)', // Dark background color
    color: 'white', // Text color
    minHeight: '100vh',
  };

  const pageTitleStyle = {
    fontSize: '2rem',
    marginBottom: '20px',
    color: 'white',
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '16px',
    width: '100%',
    maxWidth: '1200px',
  };

  return (
    <div style={containerStyle}>
      <h1 style={pageTitleStyle}>Movie Gallery</h1>
      <div style={gridStyle}>
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
    </div>
  );
};

export default HomePage;
