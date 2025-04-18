// src/components/MovieCard.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Movie } from '../types/types';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/global.css';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { setRating, getRating } from '../services/authService';
import { FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';

interface MovieCardProps {
  movie: Movie;
  isInFilms: boolean;
  style?: React.CSSProperties;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, isInFilms, style }) => {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [rating, setLocalRating] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (user) {
      getRating(user.uid, movie.movie_id).then(r => setLocalRating(r));
    }
  }, [user, movie.movie_id]);

  // Make poster clickable to go to details (except on HomePage carousel, which should pass a prop to disable this if needed)
  const handlePosterClick = () => {
    navigate(`/movie/${movie.movie_id}`);
  };

  return (
    <div
      className="w-[200px] h-[320px] flex flex-col items-center justify-start mx-auto relative overflow-visible group cursor-pointer"
      style={style}
      onClick={handlePosterClick}
    >
      <img
        src={movie.posterPath || 'https://via.placeholder.com/200x300'}
        alt={movie.title}
        className={`rounded-2xl object-cover shadow-xl border-2 border-transparent bg-gray-900/80 transition-transform duration-200 group-hover:scale-105
          ${isInFilms ? 'group-hover:border-green-400' : 'group-hover:border-cyan-400'}`}
        style={{ width: '200px', height: '300px' }}
      />
      {/* Always reserve space for the rating, even if not rated, to keep grid aligned */}
      <div className="h-7 flex items-center justify-center w-full mt-2">
        {rating !== null && (
          <span className="text-sm text-gray-300 flex items-center gap-1 font-semibold">
            {rating.toFixed(1)}
            <span className="text-gray-400 text-base">★</span>
          </span>
        )}
      </div>
    </div>
  );
};

export default MovieCard;
