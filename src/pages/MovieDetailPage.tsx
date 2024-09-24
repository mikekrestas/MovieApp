import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Movie } from '../types/types';
import { addFavorite, removeFavorite, addWatchlist, removeWatchlist } from '../services/authService';
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
  const [movie, setMovie] = useState<Movie | null>(null); // Initialize as null
  const [isInWatchlist, setIsInWatchlist] = useState(false); // New state for watchlist

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(`http://www.omdbapi.com/?i=${id}&plot=full&apikey=88e8fc3`); // Include your API key
        const data = await response.json();
        console.log('Fetched Movie Details:', data);
        
        if (data.Response === "True") {
          setMovie({
            movie_id: data.imdbID,
            title: data.Title,
            description: data.Plot || 'No Description',
            releaseDate: data.Released || 'Unknown Release Date',
            posterPath: data.Poster || '',
            director: data.Director || 'No Director',
            actors: data.Actors || 'No Actors',
            genre: data.Genre || 'No Genre',
            imdbRating: data.imdbRating || 'No IMDb Rating',
            language: data.Language || 'No Language',
            runtime: data.Runtime || 'No Runtime',
            boxOffice: data.BoxOffice !== "N/A" ? data.BoxOffice : 'Unknown Box Office',
            production: data.Production !== "N/A" ? data.Production : 'Unknown Production',
          });
        } else {
          console.error(`Movie not found: ${data.Error}`);
        }
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }
    };

    fetchMovieDetails();
  }, [id]);

  // Combine movies and searchResults
  const combinedMovies = [...movies, ...(searchResults || [])];

  // Find the movie from combinedMovies
  const foundMovie = combinedMovies.find(m => m.movie_id === id);

  // Debugging: Log the movie ID from the URL
  console.log('Movie ID from URL:', id);

  // Use foundMovie if movie is not fetched yet
  const displayMovie = movie || foundMovie;

  // Debugging: Log the IDs of combined movies
  console.log('Logging all combined movie IDs:');
  combinedMovies.forEach(movie => {
    console.log(`Movie ID: ${movie.movie_id}, Title: ${movie.title}`);
  });

  if (!displayMovie) {
    console.error(`No movie found with ID: ${id}`);
    return (
      <div className="text-center text-white my-5">
        <h1>Movie not found</h1>
      </div>
    );
  }

  const isFavorite = favorites.some(favorite => favorite.movie_id === displayMovie.movie_id);

  const handleFavorite = async () => {
    if (!user) {
      alert("Please log in to add favorites");
      return;
    }

    if (isFavorite) {
      await removeFavorite(user.uid, displayMovie.movie_id);
      setFavorites(favorites.filter(fav => fav.movie_id !== displayMovie.movie_id));
    } else {
      await addFavorite(user.uid, displayMovie);
      setFavorites([...favorites, displayMovie]);
    }
  };

  // Handle adding/removing from watchlist
  const handleWatchlist = async () => {
    if (!user) {
      alert("Please log in to manage your watchlist");
      return;
    }

    if (isInWatchlist) {
      await removeWatchlist(user.uid, displayMovie.movie_id);
    } else {
      await addWatchlist(user.uid, displayMovie);
    }
    setIsInWatchlist(!isInWatchlist); // Toggle watchlist state
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-dark text-white">
      <div className="container my-5 flex-grow-1 d-flex flex-column justify-content-center">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card bg-dark text-white border-0">
              <img
                src={displayMovie.posterPath || 'https://via.placeholder.com/400x600'}
                alt={displayMovie.title}
                className="card-img-top"
                style={{ width: '100%', maxWidth: '300px', borderRadius: '8px' }}
              />
              <div className="card-body">
                <h1 className="card-title mb-4">{displayMovie.title || 'Title not available'}</h1>
                <div className="mb-4">
                  <p><strong>Release Date:</strong> {displayMovie.releaseDate || 'N/A'}</p>
                  <p><strong>Genre:</strong> {displayMovie.genre || 'N/A'}</p>
                  <p><strong>Director:</strong> {displayMovie.director || 'N/A'}</p>
                  <p><strong>Actors:</strong> {displayMovie.actors || 'N/A'}</p>
                  <p><strong>Runtime:</strong> {displayMovie.runtime || 'N/A'}</p>
                  <p><strong>IMDb Rating:</strong> {displayMovie.imdbRating || 'N/A'}</p>
                  <p><strong>Box Office:</strong> {displayMovie.boxOffice || 'N/A'}</p>
                  <p><strong>Production:</strong> {displayMovie.production || 'N/A'}</p>
                </div>
                <h2 className="mb-3">Plot</h2>
                <p className="card-text">{displayMovie.description || 'No plot available'}</p>

                {/* Favorite Button */}
                <button
                  onClick={handleFavorite}
                  className={`btn ${isFavorite ? 'btn-danger' : 'btn-primary'} btn-lg`}
                >
                  {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                </button>

                {/* Watchlist Button */}
                <button
                  onClick={handleWatchlist}
                  className={`btn ${isInWatchlist ? 'btn-warning' : 'btn-secondary'} btn-lg ml-3`}
                >
                  {isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
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
