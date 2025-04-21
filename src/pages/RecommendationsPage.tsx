import React, { useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { getFavorites, getFilms, getWatchlist } from '../services/authService';
import { getRecommendations } from '../services/recommendationService';
import MovieCard from '../components/MovieCard';
import { Movie } from '../types/types';
import MovieFilterBar from '../components/MovieFilterBar';

interface RecommendationsPageProps {
  user: User | null;
}

const RecommendationsPage: React.FC<RecommendationsPageProps> = ({ user }) => {
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [films, setFilms] = useState<Movie[]>([]);
  const [filter, setFilter] = useState({
    search: '',
    genres: [] as string[],
    decade: '',
    yearRange: [1900, 2025] as [number, number],
    imdbRating: [0, 10] as [number, number],
    runtime: [0, 500] as [number, number],
    country: '',
    language: '',
    director: '',
    sort: 'title',
  });

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (user) {
        const [favoriteMovies, userFilms, watchlistMovies] = await Promise.all([
          getFavorites(user.uid),
          getFilms(user.uid),
          getWatchlist(user.uid)
        ]);
        const favoriteMovieIds = favoriteMovies.map(movie => movie.movie_id);
        const watchedMovieIds = userFilms.map(movie => movie.movie_id);
        const watchlistMovieIds = watchlistMovies.map(movie => movie.movie_id);
        const recommendedMovies = await getRecommendations({
          favorite_movie_ids: favoriteMovieIds,
          watched_movie_ids: watchedMovieIds,
          watchlist_movie_ids: watchlistMovieIds
        }, 18);
        setRecommendations(recommendedMovies);
        setFilms(userFilms);
      }
    };
    fetchRecommendations();
  }, [user]);

  const getUnique = (arr: string[]) => Array.from(new Set(arr)).filter(Boolean).sort();
  const getGenres = (movies: Movie[]) => getUnique(movies.flatMap(m => m.genre?.split(',').map(g => g.trim()) || []));
  const getCountries = (movies: Movie[]) => getUnique(movies.flatMap(m => m.country?.split(',').map(c => c.trim()) || []));
  const getLanguages = (movies: Movie[]) => getUnique(movies.flatMap(m => m.language?.split(',').map(l => l.trim()) || []));
  const getDirectors = (movies: Movie[]) => getUnique(movies.flatMap(m => m.director?.split(',').map(d => d.trim()) || []));
  const getDecades = (movies: Movie[]) => {
    const years = movies.map(m => parseInt(m.releaseDate?.slice(0, 4))).filter(y => !isNaN(y));
    const decades = years.map(y => `${Math.floor(y / 10) * 10}s`);
    return getUnique(decades);
  };
  const getYearRange = (movies: Movie[]): [number, number] => {
    const years = movies.map(m => parseInt(m.releaseDate?.slice(0, 4))).filter(y => !isNaN(y));
    if (years.length === 0) return [1900, 2025];
    const min = Math.min(...years);
    const max = Math.max(...years);
    return [min, max];
  };
  const getRatingRange = (movies: Movie[]): [number, number] => {
    const ratings = movies.map(m => parseFloat(m.imdbRating)).filter(r => !isNaN(r));
    if (ratings.length === 0) return [0, 10];
    const min = Math.min(...ratings);
    const max = Math.max(...ratings);
    return [min, max];
  };
  const getRuntimeRange = (movies: Movie[]): [number, number] => {
    const runtimes = movies.map(m => parseInt((m.runtime||'').split(' ')[0])).filter(r => !isNaN(r));
    if (runtimes.length === 0) return [0, 500];
    const min = Math.min(...runtimes);
    const max = Math.max(...runtimes);
    return [min, max];
  };

  const sortOptions = [
    { value: 'title', label: 'Title (A-Z)' },
    { value: 'releaseDate', label: 'Release Date' },
    { value: 'imdbRating', label: 'IMDb Rating' },
    { value: 'runtime', label: 'Runtime' },
  ];

  const handleClear = () => {
    setFilter({
      search: '',
      genres: [] as string[],
      decade: '',
      yearRange: getYearRange(recommendations) as [number, number],
      imdbRating: getRatingRange(recommendations) as [number, number],
      runtime: getRuntimeRange(recommendations) as [number, number],
      country: '',
      language: '',
      director: '',
      sort: 'title',
    });
  };

  const filteredRecommendations = recommendations.filter(movie => {
    const year = parseInt(movie.releaseDate?.slice(0, 4));
    const decade = year ? `${Math.floor(year / 10) * 10}s` : '';
    const rating = parseFloat(movie.imdbRating);
    const runtime = parseInt((movie.runtime||'').split(' ')[0]);
    return (
      (!filter.search || movie.title.toLowerCase().includes(filter.search.toLowerCase())) &&
      (filter.genres.length === 0 || filter.genres.every(g => movie.genre?.split(',').map(x => x.trim()).includes(g))) &&
      (!filter.decade || decade === filter.decade) &&
      (!filter.country || (movie.country||'').split(',').map(c => c.trim()).includes(filter.country)) &&
      (!filter.language || (movie.language||'').split(',').map(l => l.trim()).includes(filter.language)) &&
      (!filter.director || (movie.director||'').split(',').map(d => d.trim()).includes(filter.director)) &&
      (!isNaN(year) && year >= filter.yearRange[0] && year <= filter.yearRange[1]) &&
      (!isNaN(rating) && rating >= filter.imdbRating[0] && rating <= filter.imdbRating[1]) &&
      (!isNaN(runtime) && runtime >= filter.runtime[0] && runtime <= filter.runtime[1])
    );
  }).sort((a, b) => {
    if (filter.sort === 'title') {
      return a.title.localeCompare(b.title);
    } else if (filter.sort === 'releaseDate') {
      return (b.releaseDate || '').localeCompare(a.releaseDate || '');
    } else if (filter.sort === 'imdbRating') {
      return parseFloat(b.imdbRating || '0') - parseFloat(a.imdbRating || '0');
    } else if (filter.sort === 'runtime') {
      return parseInt((b.runtime||'').split(' ')[0] || '0') - parseInt((a.runtime||'').split(' ')[0] || '0');
    }
    return 0;
  });

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
    <div className="bg-gradient-to-br from-gray-900 via-gray-950 to-gray-800 min-h-screen pt-24 flex flex-col items-center">
      <h1 className="my-3 text-4xl font-bold text-white drop-shadow-lg">Recommended Movies</h1>
      <div className="w-full max-w-6xl px-4">
        <MovieFilterBar
          genres={getGenres(recommendations)}
          countries={getCountries(recommendations)}
          languages={getLanguages(recommendations)}
          directors={getDirectors(recommendations)}
          decades={getDecades(recommendations)}
          sortOptions={sortOptions}
          filter={filter}
          onFilterChange={setFilter}
          onClear={handleClear}
        />
      </div>
      {filteredRecommendations.length === 0 ? (
        <p className="text-center text-xl text-gray-300">No recommendations match your filter.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {filteredRecommendations.map((movie) => (
            <MovieCard key={movie.movie_id} movie={movie} style={{}} isInFilms={isInFilms(movie.movie_id)} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RecommendationsPage;