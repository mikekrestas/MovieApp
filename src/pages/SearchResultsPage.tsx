import React from 'react';
import { Link } from 'react-router-dom';
import { Movie } from '../types/types';

interface SearchResultsPageProps {
  searchResults?: Movie[]; // Make it optional to handle the case where no results are passed
}

const SearchResultsPage: React.FC<SearchResultsPageProps> = ({ searchResults = [] }) => {
  return (
    <div className="bg-dark text-white min-vh-100 d-flex flex-column align-items-center">
      <h1 className="my-5 text-center text-uppercase font-weight-bold" style={{ fontSize: '3rem', color: '#ffcc00' }}>
        Search Results
      </h1>
      <div className="container">
        <div className="row">
          {searchResults.map((movie) => (
            <div key={movie.movie_id} className="col-sm-6 col-md-4 col-lg-3 mb-4 d-flex justify-content-center">
              <div className="card bg-secondary text-white h-100" style={{ border: 'none' }}>
                <Link to={`/movie/${movie.movie_id}`} className="text-white text-decoration-none">
                  <img 
                    src={movie.posterPath} 
                    alt={movie.title} 
                    className="card-img-top" 
                    style={{ 
                      width: '100%', 
                      height: 'auto', 
                      maxHeight: '350px', 
                      objectFit: 'contain' 
                    }} 
                  />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchResultsPage;
