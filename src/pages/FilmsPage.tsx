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

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-950 to-gray-800 min-h-screen pt-24 flex flex-col items-center">
      <h1 className="my-5 text-4xl font-bold text-white drop-shadow-lg">My Films</h1>
      {films.length === 0 ? (
        <p className="text-center text-xl text-gray-300">Your films list is empty.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {films.map((movie) => (
            <MovieCard key={movie.movie_id} movie={movie} style={{}} isInFilms={true} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FilmsPage;