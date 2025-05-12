// src/pages/MovieDetailPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Movie } from '../types/types';
import { addFavorite, removeFavorite, addWatchlist, removeWatchlist, addFilm, removeFilm, getWatchlist, getFilms, setRating, getRating, addReview, getReviews, Review, reactToReview, deleteReview } from '../services/authService';
import { fetchMovieDetails } from '../services/movieService';
import { User } from 'firebase/auth';
import Rating from 'react-rating';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';

// Emoji reactions to offer
const REACTION_EMOJIS = ['👍', '😂', '😮', '😢', '❤️'];

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
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Move displayMovie above useEffects to avoid TS error
  const combinedMovies = [...movies, ...(searchResults || [])];
  const foundMovie = combinedMovies.find(m => m.movie_id === id);
  const displayMovie = movie || foundMovie;

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

  useEffect(() => {
    if (displayMovie) {
      getReviews(displayMovie.movie_id).then(setReviews);
    }
  }, [displayMovie]);

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

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !displayMovie || !reviewText.trim()) return;
    setSubmitting(true);
    const review: Review = {
      userId: user.uid,
      username: user.displayName || 'Anonymous',
      movieId: displayMovie.movie_id,
      reviewText: reviewText.trim(),
      timestamp: Date.now(),
    };
    await addReview(displayMovie.movie_id, review);
    setReviewText('');
    // Refresh reviews
    const updated = await getReviews(displayMovie.movie_id);
    setReviews(updated);
    setSubmitting(false);
  };

  // Reaction handler
  const handleReact = async (reviewId: string, emoji: string) => {
    if (!user || !displayMovie) return;
    await reactToReview(displayMovie.movie_id, reviewId, emoji, user.uid);
    // Refresh reviews
    const updated = await getReviews(displayMovie.movie_id);
    setReviews(updated);
  };

  const handleDeleteReview = async () => {
    if (!userReview?.id || !displayMovie) return;
    await deleteReview(displayMovie.movie_id, userReview.id);
    setShowDeleteConfirm(false);
    // Refresh reviews
    const updated = await getReviews(displayMovie.movie_id);
    setReviews(updated);
  };

  // Find current user's review (if any)
  const userReview = user && reviews.find(r => r.userId === user.uid);
  const otherReviews = reviews.filter(r => !user || r.userId !== user.uid);

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-950 to-gray-800 min-h-screen pt-24 flex flex-col items-center">
      <div className="w-full max-w-3xl px-4 flex flex-col items-center">
        <h1 className="my-5 text-4xl font-bold text-white drop-shadow-lg text-center">{displayMovie.title || 'Title not available'}</h1>
        <div className="flex flex-col md:flex-row gap-8 w-full bg-white/5 rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex-shrink-0 flex justify-center items-start w-full md:w-1/3">
            <img
              src={displayMovie.posterPath || 'https://via.placeholder.com/400x600'}
              alt={displayMovie.title}
              className={`movie-poster${isInFilms ? ' in-films' : ''} shadow-lg`}
              style={{ maxWidth: '260px', minWidth: '180px', maxHeight: '400px', objectFit: 'cover' }}
            />
          </div>
          <div className="flex flex-col gap-4 w-full md:w-2/3">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-cyan-100 text-sm">
              <div><span className="font-semibold text-cyan-300">Release Date:</span> {displayMovie.releaseDate || 'N/A'}</div>
              <div><span className="font-semibold text-cyan-300">Genre:</span> {displayMovie.genre || 'N/A'}</div>
              <div><span className="font-semibold text-cyan-300">Director:</span> {displayMovie.director || 'N/A'}</div>
              <div><span className="font-semibold text-cyan-300">Actors:</span> {displayMovie.actors || 'N/A'}</div>
              <div><span className="font-semibold text-cyan-300">Runtime:</span> {displayMovie.runtime || 'N/A'}</div>
              <div><span className="font-semibold text-cyan-300">IMDb Rating:</span> {displayMovie.imdbRating || 'N/A'}</div>
              <div><span className="font-semibold text-cyan-300">Box Office:</span> {displayMovie.boxOffice || 'N/A'}</div>
              <div><span className="font-semibold text-cyan-300">Production:</span> {displayMovie.production || 'N/A'}</div>
              <div><span className="font-semibold text-cyan-300">Language:</span> {displayMovie.language || 'N/A'}</div>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white mb-1 mt-2">Plot</h2>
              <p className="text-gray-300 text-sm">{displayMovie.description || 'No plot available'}</p>
            </div>
            <div className="flex flex-wrap gap-3 mt-4">
              <button
                onClick={handleFavorite}
                className={`px-4 py-2 rounded font-semibold shadow transition-colors duration-150 ${isFavorite ? 'bg-yellow-500 hover:bg-yellow-400 text-white' : 'bg-cyan-700 hover:bg-cyan-500 text-white'}`}
              >
                {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
              </button>
              <button
                onClick={handleWatchlist}
                className={`px-4 py-2 rounded font-semibold shadow transition-colors duration-150 ${isInWatchlist ? 'bg-pink-600 hover:bg-pink-400 text-white' : 'bg-cyan-700 hover:bg-cyan-500 text-white'}`}
              >
                {isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
              </button>
              <button
                onClick={handleFilms}
                className={`px-4 py-2 rounded font-semibold shadow transition-colors duration-150 ${isInFilms ? 'bg-green-600 hover:bg-green-400 text-white' : 'bg-cyan-700 hover:bg-cyan-500 text-white'}`}
              >
                {isInFilms ? 'Remove from Films' : 'Add to Films'}
              </button>
            </div>
          </div>
        </div>
        {/* Review Section moved to bottom */}
        <div className="w-full mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Reviews</h2>
          {/* User's review pinned at top */}
          {userReview && (
            <div className="mb-4 p-4 rounded-lg bg-cyan-900/40 border border-cyan-400 text-white flex items-start justify-between">
              <div className="flex-1">
                <div className="font-semibold text-cyan-300 mb-1">Your Review</div>
                <div className="text-sm whitespace-pre-line">{userReview.reviewText}</div>
                <div className="text-xs text-gray-400 mt-1">{new Date(userReview.timestamp).toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                <div className="flex gap-2 mt-2">
                  {REACTION_EMOJIS.map(emoji => (
                    <button
                      key={emoji}
                      type="button"
                      className={`px-2 py-1 rounded hover:bg-cyan-800/60 transition ${userReview.reactions?.[emoji]?.includes(user?.uid ?? '') ? 'bg-cyan-600/80' : 'bg-cyan-900/40'}`}
                      onClick={() => userReview.id && handleReact(userReview.id, emoji)}
                    >
                      {emoji} {userReview.reactions?.[emoji]?.length ? userReview.reactions[emoji].length : ''}
                    </button>
                  ))}
                </div>
              </div>
              <button
                className="ml-4 text-gray-400 hover:text-red-500 text-xl"
                title="Delete review"
                onClick={() => setShowDeleteConfirm(true)}
              >
                🗑️
              </button>
            </div>
          )}
          {/* Delete confirmation popup */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
              <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-cyan-400 flex flex-col items-center">
                <div className="text-white text-lg mb-4">Are you sure you want to delete your review?</div>
                <div className="flex gap-4">
                  <button
                    className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold"
                    onClick={handleDeleteReview}
                  >
                    Yes, Delete
                  </button>
                  <button
                    className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-white font-semibold"
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* Other reviews */}
          {(!userReview && otherReviews.length === 0) ? (
            <div className="text-gray-400 text-sm">No reviews yet. Be the first to review!</div>
          ) : (
            <div className="flex flex-col gap-4">
              {otherReviews.map((r, i) => (
                <div key={r.userId + r.timestamp + i} className="p-4 rounded-lg bg-gray-900/60 border border-cyan-900 text-white">
                  <div className="font-semibold text-cyan-300 mb-1">{r.username}</div>
                  <div className="text-sm whitespace-pre-line">{r.reviewText}</div>
                  <div className="text-xs text-gray-400 mt-1">{new Date(r.timestamp).toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                  <div className="flex gap-2 mt-2">
                    {REACTION_EMOJIS.map(emoji => (
                      <button
                        key={emoji}
                        type="button"
                        className={`px-2 py-1 rounded hover:bg-cyan-800/60 transition ${r.reactions?.[emoji]?.includes(user?.uid ?? '') ? 'bg-cyan-600/80' : 'bg-cyan-900/40'}`}
                        onClick={() => r.id && handleReact(r.id, emoji)}
                      >
                        {emoji} {r.reactions?.[emoji]?.length ? r.reactions[emoji].length : ''}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* Review form at the bottom */}
          {user && (
            <form onSubmit={handleReviewSubmit} className="mt-6 flex flex-col gap-2">
              <textarea
                className="w-full rounded-lg p-2 border border-cyan-400 bg-gray-900/80 text-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                rows={3}
                placeholder="Write your review..."
                value={reviewText}
                onChange={e => setReviewText(e.target.value)}
                disabled={submitting}
              />
              <button
                type="submit"
                className="self-end px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-white text-sm font-semibold shadow"
                disabled={submitting || !reviewText.trim()}
              >
                {userReview ? 'Update Review' : 'Post Review'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;
