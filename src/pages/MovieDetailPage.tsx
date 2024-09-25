// 
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Movie } from '../types/types';
import { addFavorite, removeFavorite, addWatchlist, removeWatchlist } from '../services/authService';
import { User } from 'firebase/auth';

// Material-UI components
import { Box, Button, Typography, Paper } from '@mui/material';

interface MovieDetailPageProps {
  user: User | null;
  favorites: Movie[];
  setFavorites: (movies: Movie[]) => void;
  movies: Movie[];
  searchResults?: Movie[];
}

const MovieDetailPage: React.FC<MovieDetailPageProps> = ({ user, favorites, setFavorites, movies, searchResults }) => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(`http://www.omdbapi.com/?i=${id}&plot=full&apikey=88e8fc3`); // Include your API key
        const data = await response.json();

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

  const combinedMovies = [...movies, ...(searchResults || [])];
  const foundMovie = combinedMovies.find(m => m.movie_id === id);
  const displayMovie = movie || foundMovie;

  if (!displayMovie) {
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
                  <Typography variant="body1"><strong>Release Date:</strong> {displayMovie.releaseDate || 'N/A'}</Typography>
                  <Typography variant="body1"><strong>Genre:</strong> {displayMovie.genre || 'N/A'}</Typography>
                  <Typography variant="body1"><strong>Director:</strong> {displayMovie.director || 'N/A'}</Typography>
                  <Typography variant="body1"><strong>Actors:</strong> {displayMovie.actors || 'N/A'}</Typography>
                  <Typography variant="body1"><strong>Runtime:</strong> {displayMovie.runtime || 'N/A'}</Typography>
                  <Typography variant="body1"><strong>IMDb Rating:</strong> {displayMovie.imdbRating || 'N/A'}</Typography>
                  <Typography variant="body1"><strong>Box Office:</strong> {displayMovie.boxOffice || 'N/A'}</Typography>
                  <Typography variant="body1"><strong>Production:</strong> {displayMovie.production || 'N/A'}</Typography>
                </div>

                <h2 className="mb-3">Plot</h2>
                <Typography variant="body2" className="mb-4">
                  {displayMovie.description || 'No plot available'}
                </Typography>

                {/* Buttons Container */}
                <Paper elevation={3} sx={{ padding: 2, marginTop: 2, textAlign: 'center' }}>
                  <Box display="flex" justifyContent="space-around" sx={{ gap: 2 }}>
                    <Button
                      onClick={handleFavorite}
                      variant={isFavorite ? 'contained' : 'outlined'}
                      color={isFavorite ? 'error' : 'primary'}
                    >
                      {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                    </Button>

                    <Button
                      onClick={handleWatchlist}
                      variant={isInWatchlist ? 'contained' : 'outlined'}
                      color={isInWatchlist ? 'warning' : 'secondary'}
                    >
                      {isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
                    </Button>
                  </Box>
                </Paper>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;
