// src/pages/SearchResultsPage.tsx
import React from 'react';
import { Movie } from '../types/types';
import MovieCard from '../components/MovieCard';
import { User } from 'firebase/auth';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../index.css';

interface SearchResultsPageProps {
  user: User | null;
  searchResults: Movie[];
  films: Movie[];
}

const SearchResultsPage: React.FC<SearchResultsPageProps> = ({ user, searchResults, films }) => {
  const movieCardStyle: React.CSSProperties = {
    width: '200px',
    height: '300px',
    borderRadius: '10px',
    transition: 'transform 0.3s ease, border-color 0.3s ease',
    display: 'block',
    margin: '0 auto',
    position: 'relative',
    top: '0',
  };

  return (
    <div className="bg-dark text-white min-vh-100 d-flex flex-column align-items-center">
      <h1 className="my-5">Search Results</h1>
      <div className="container">
        {searchResults.length === 0 ? (
          <p className="text-center" style={{ fontSize: '1.5rem' }}>No results found.</p>
        ) : (
          <div className="row">
            {searchResults.map((movie) => (
              <div key={movie.movie_id} className="col-6 col-sm-4 col-md-3 col-lg-2 mb-4">
                <MovieCard movie={movie} style={movieCardStyle} isInFilms={films.some(film => film.movie_id === movie.movie_id)} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;
