import React, { useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { getFilms } from '../services/authService';
import MovieCard from '../components/MovieCard';
import { Movie } from '../types/types';

interface FilmsPageProps {
  user: User | null;
}

const FilmsPage: React.FC<FilmsPageProps> = ({ user }) => {
  const [films, setFilms] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchFilms = async () => {
      if (user) {
        const movies = await getFilms(user.uid);
        setFilms(movies);
      }
    };
    fetchFilms();
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

  return (
    <div className="bg-dark text-white min-vh-100 d-flex flex-column align-items-center">
      <h1 className="my-5">My Films</h1>
      <div className="container">
        {films.length === 0 ? (
          <p className="text-center" style={{ fontSize: '1.5rem' }}>Your films list is empty.</p>
        ) : (
          <div className="row">
            {films.map((movie) => (
              <div key={movie.movie_id} className="col-6 col-sm-4 col-md-3 col-lg-2 mb-4">
                <MovieCard movie={movie} style={movieCardStyle} isInFilms={true} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilmsPage;