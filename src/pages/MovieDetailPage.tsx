import React from 'react';
import { useParams } from 'react-router-dom';
import { Movie } from '../types/types';
import { addFavorite, removeFavorite } from '../services/authService';
import { User } from 'firebase/auth';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported

interface MovieDetailPageProps {
  user: User | null;
  favorites: Movie[];
  setFavorites: (movies: Movie[]) => void;
  movies: Movie[];
  searchResults?: Movie[];
}

const MovieDetailPage: React.FC<MovieDetailPageProps> = ({ user, favorites, setFavorites, movies, searchResults }) => {
  const { id } = useParams<{ id: string }>();

  // Combine movies and searchResults
  const combinedMovies = [...movies, ...(searchResults || [])];

  // Find the movie from combinedMovies
  const movie = combinedMovies.find(m => m.id === id);

  // Debugging: Log the movie ID from the URL
  console.log('Movie ID from URL:', id);

  // Debugging: Log the IDs of combined movies
  console.log('Logging all combined movie IDs:');
  combinedMovies.forEach(movie => {
    console.log(`Movie ID: ${movie.id}, Title: ${movie.title}`);
  });

  if (!movie) {
    console.error(`No movie found with ID: ${id}`);
    return (
      <div className="text-center text-white my-5">
        <h1>Movie not found</h1>
      </div>
    );
  }

  const isFavorite = favorites.some(favorite => favorite.id === movie.id);

  const handleFavorite = async () => {
    if (!user) {
      alert("Please log in to add favorites");
      return;
    }

    if (isFavorite) {
      await removeFavorite(user.uid, movie.id);
      setFavorites(favorites.filter(fav => fav.id !== movie.id));
    } else {
      await addFavorite(user.uid, movie);
      setFavorites([...favorites, movie]);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-dark text-white">
      <div className="container my-5 flex-grow-1 d-flex flex-column justify-content-center">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card bg-dark text-white border-0">
              <img
                src={movie.posterPath || 'https://via.placeholder.com/400x600'}
                alt={movie.title}
                className="card-img-top"
                style={{ width: '100%', maxWidth: '300px', borderRadius: '8px' }}
              />
              <div className="card-body">
                <h1 className="card-title mb-4">{movie.title || 'Title not available'}</h1>
                <div className="mb-4">
                  <p><strong>Release Date:</strong> {movie.releaseDate || 'N/A'}</p>
                  <p><strong>Genre:</strong> {movie.genre || 'N/A'}</p>
                  <p><strong>Director:</strong> {movie.director || 'N/A'}</p>
                  <p><strong>Actors:</strong> {movie.actors || 'N/A'}</p>
                  <p><strong>Runtime:</strong> {movie.runtime || 'N/A'}</p>
                  <p><strong>IMDb Rating:</strong> {movie.imdbRating || 'N/A'}</p>
                  <p><strong>Box Office:</strong> {movie.boxOffice || 'N/A'}</p>
                  <p><strong>Production:</strong> {movie.production || 'N/A'}</p>
                </div>
                <h2 className="mb-3">Plot</h2>
                <p className="card-text">{movie.description || 'No plot available'}</p>
                <button
                  onClick={handleFavorite}
                  className={`btn ${isFavorite ? 'btn-danger' : 'btn-primary'} btn-lg`}
                >
                  {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;
