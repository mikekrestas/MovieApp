import React, { useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { getFavorites, getFilms } from '../services/authService';
import { getRecommendations } from '../services/recommendationService';
import MovieCard from '../components/MovieCard';
import { Movie } from '../types/types';

interface RecommendationsPageProps {
  user: User | null;
}

const RecommendationsPage: React.FC<RecommendationsPageProps> = ({ user }) => {
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [films, setFilms] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (user) {
        const favoriteMovies = await getFavorites(user.uid);
        const favoriteMovieIds = favoriteMovies.map(movie => movie.movie_id);
        const recommendedMovies = await getRecommendations(favoriteMovieIds);
        setRecommendations(recommendedMovies);

        const userFilms = await getFilms(user.uid);
        setFilms(userFilms);
      }
    };
    fetchRecommendations();
  }, [user]);

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

  const isInFilms = (movieId: string) => {
    return films.some(film => film.movie_id === movieId);
  };

  return (
    <div className="bg-dark text-white min-vh-100 d-flex flex-column align-items-center">
      <h1 className="my-5">Recommended Movies</h1>
      <div className="container">
        {recommendations.length === 0 ? (
          <p className="text-center" style={{ fontSize: '1.5rem' }}>No recommendations available.</p>
        ) : (
          <div className="row">
            {recommendations.map((movie) => (
              <div key={movie.movie_id} className="col-6 col-sm-4 col-md-3 col-lg-2 mb-4">
                <MovieCard movie={movie} style={movieCardStyle} isInFilms={isInFilms(movie.movie_id)} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendationsPage;