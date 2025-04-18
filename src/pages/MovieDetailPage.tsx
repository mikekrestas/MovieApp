// src/pages/MovieDetailPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Movie } from '../types/types';
import { addFavorite, removeFavorite, addWatchlist, removeWatchlist, addFilm, removeFilm, getWatchlist, getFilms, setRating, getRating } from '../services/authService';
import { fetchMovieDetails } from '../services/movieService';
import { User } from 'firebase/auth';
import { Box, Button, Typography, Paper } from '@mui/material';
import Rating from 'react-rating';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';

interface MovieDetailPageProps {
  user: User | null;
  favorites: Movie[];
  setFavorites: (movies: Movie[]) => void;
  movies: Movie[];
  searchResults?: Movie[];
  films: Movie[];
}

const MovieDetailPage: React.FC<MovieDetailPageProps> = ({ user, favorites, setFavorites, movies, searchResults, films }) => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isInFilms, setIsInFilms] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [rating, setLocalRating] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [authUser] = useAuthState(auth);

  useEffect(() => {
    const fetchMovieDetailsAsync = async () => {
      try {
        const movieDetails = await fetchMovieDetails(id!);
        setMovie(movieDetails);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }
    };

    const checkWatchlistStatus = async () => {
      if (user) {
        const watchlist = await getWatchlist(user.uid);
        const isMovieInWatchlist = watchlist.some(movie => movie.movie_id === id);
        setIsInWatchlist(isMovieInWatchlist);
      }
    };

    const checkFilmsStatus = async () => {
      if (user) {
        const films = await getFilms(user.uid);
        const isMovieInFilms = films.some(movie => movie.movie_id === id);
        setIsInFilms(isMovieInFilms);
      }
    };

    fetchMovieDetailsAsync();
    checkWatchlistStatus();
    checkFilmsStatus();
  }, [id, user]);

  useEffect(() => {
    if (authUser && movie) {
      getRating(authUser.uid, movie.movie_id).then(r => setLocalRating(r));
    }
  }, [authUser, movie]);

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
      setIsInWatchlist(false); // Update state after removal
    } else {
      await addWatchlist(user.uid, displayMovie);
      setIsInWatchlist(true); // Update state after addition
    }
  };

  const handleFilms = async () => {
    if (!user) {
      alert("Please log in to manage your films");
      return;
    }

    if (isInFilms) {
      await removeFilm(user.uid, displayMovie.movie_id);
      setIsInFilms(false); // Update state after removal
    } else {
      await addFilm(user.uid, displayMovie);
      setIsInFilms(true); // Update state after addition
    }
  };

  const handleRatingChange = async (newRating: number) => {
    if (authUser && displayMovie) {
      setLoading(true);
      await setRating(authUser.uid, displayMovie.movie_id, newRating);
      setLocalRating(newRating);
      setLoading(false);
      setShowModal(false);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-dark text-white">
      <div className="container my-5 flex-grow-1 d-flex flex-column justify-content-center" style={{ paddingTop: '40px' }}>
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
                {authUser && (
                  <div className="flex flex-col items-start gap-2 mt-2">
                    <div className="flex items-center gap-2">
                      {/* @ts-ignore */}
                      <Rating
                        initialRating={rating || 0}
                        onChange={handleRatingChange}
                        emptySymbol={<FaRegStar className="text-3xl text-gray-600 transition-colors duration-150" />}
                        fullSymbol={<FaStar className="text-3xl text-yellow-400 transition-colors duration-150" />}
                        fractions={2}
                        stop={10}
                        readonly={loading}
                      />
                      {rating !== null && (
                        <span className="text-xs text-gray-300 flex items-center gap-1 ml-2">
                          {rating.toFixed(1)}
                          <span className="text-yellow-400 text-sm">★</span>
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400">(Hover and click to rate)</span>
                  </div>
                )}
                <div className="mb-4">
                  <Typography variant="body1"><strong>Release Date:</strong> {displayMovie.releaseDate || 'N/A'}</Typography>
                  <Typography variant="body1"><strong>Genre:</strong> {displayMovie.genre || 'N/A'}</Typography>
                  <Typography variant="body1"><strong>Director:</strong> {displayMovie.director || 'N/A'}</Typography>
                  <Typography variant="body1"><strong>Actors:</strong> {displayMovie.actors || 'N/A'}</Typography>
                  <Typography variant="body1"><strong>Runtime:</strong> {displayMovie.runtime || 'N/A'}</Typography>
                  <Typography variant="body1"><strong>IMDb Rating:</strong> {displayMovie.imdbRating || 'N/A'}</Typography>
                  <Typography variant="body1"><strong>Box Office:</strong> {displayMovie.boxOffice || 'N/A'}</Typography>
                  <Typography variant="body1"><strong>Production:</strong> {displayMovie.production || 'N/A'}</Typography>
                  <Typography variant="body1"><strong>Language:</strong> {displayMovie.language || 'N/A'}</Typography> {/* Ensure language is displayed */}
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
                      color={isFavorite ? 'warning' : 'primary'}
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

                    <Button
                      onClick={handleFilms}
                      variant={isInFilms ? 'contained' : 'outlined'}
                      color={isInFilms ? 'success' : 'primary'}
                    >
                      {isInFilms ? 'Remove from Films' : 'Add to Films'}
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
