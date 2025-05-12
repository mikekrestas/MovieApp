// src/pages/SearchResultsPage.tsx
import React from 'react';
import { Movie } from '../types/types';
import MovieCard from '../components/MovieCard';
import { User } from 'firebase/auth';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../index.css';
import MovieFilterBar from '../components/MovieFilterBar';
import { sendBuddyRequest } from '../services/authService';
import { useNavigate } from 'react-router-dom';

interface SearchResultsPageProps {
  user: User | null;
  searchResults: Movie[];
  films: Movie[];
  searchType?: 'movie' | 'user';
  userResults?: any[];
}

const SearchResultsPage: React.FC<SearchResultsPageProps> = ({ user, searchResults, films, searchType = 'movie', userResults = [] }) => {
  const [filter, setFilter] = React.useState({
    search: '',
    genres: [] as string[],
    decade: '',
    yearRange: [null, null] as [number|null, number|null],
    imdbRating: [null, null] as [number|null, number|null],
    runtime: [null, null] as [number|null, number|null],
    country: '',
    language: '',
    director: '',
    sort: 'title',
  });

  // Add buddy request state
  const [buddyRequestSent, setBuddyRequestSent] = React.useState<{ [userId: string]: boolean }>({});

  const handleAddBuddy = async (buddyId: string) => {
    if (!user) return;
    await sendBuddyRequest(user.uid, buddyId);
    setBuddyRequestSent(prev => ({ ...prev, [buddyId]: true }));
  };

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
      yearRange: [null, null],
      imdbRating: [null, null],
      runtime: [null, null],
      country: '',
      language: '',
      director: '',
      sort: 'title',
    });
  };

  const filteredResults = searchResults.filter(movie => {
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
      (filter.yearRange[0] == null || (year >= filter.yearRange[0])) &&
      (filter.yearRange[1] == null || (year <= filter.yearRange[1])) &&
      (filter.imdbRating[0] == null || (rating >= filter.imdbRating[0])) &&
      (filter.imdbRating[1] == null || (rating <= filter.imdbRating[1])) &&
      (filter.runtime[0] == null || (runtime >= filter.runtime[0])) &&
      (filter.runtime[1] == null || (runtime <= filter.runtime[1]))
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

  const navigate = useNavigate();

  if (searchType === 'user') {
    return (
      <div className="bg-gradient-to-br from-gray-900 via-gray-950 to-gray-800 min-h-screen pt-24 flex flex-col items-center">
        <h1 className="my-3 text-4xl font-bold text-white drop-shadow-lg">User Results</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 w-full max-w-6xl px-4">
          {userResults.length === 0 ? (
            <p className="text-center text-xl text-gray-300 col-span-full">No users found.</p>
          ) : (
            userResults.map((u) => (
              <div key={u.userId} className="flex flex-col items-center bg-gray-900/80 rounded-xl p-4 border border-cyan-700 shadow">
                <img
                  src={u.photoURL || 'https://via.placeholder.com/100'}
                  alt={u.username}
                  className="w-20 h-20 rounded-full mb-2 object-cover border-2 border-cyan-400"
                />
                <div className="font-semibold text-white mb-2 cursor-pointer hover:underline" onClick={() => navigate(`/profile/${u.userId}`)}>
                  {u.username}
                </div>
                <button
                  className={`px-3 py-1 rounded font-semibold text-xs ${buddyRequestSent[u.userId] ? 'bg-gray-500 text-white cursor-not-allowed' : 'bg-green-500 hover:bg-green-400 text-white'}`}
                  onClick={() => handleAddBuddy(u.userId)}
                  disabled={buddyRequestSent[u.userId]}
                >
                  {buddyRequestSent[u.userId] ? 'Request Sent' : 'Add Buddy'}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-950 to-gray-800 min-h-screen pt-24 flex flex-col items-center">
      <h1 className="my-3 text-4xl font-bold text-white drop-shadow-lg">Search Results</h1>
      <div className="w-full max-w-6xl px-4">
        <MovieFilterBar
          genres={getGenres(searchResults)}
          countries={getCountries(searchResults)}
          languages={getLanguages(searchResults)}
          directors={getDirectors(searchResults)}
          decades={getDecades(searchResults)}
          sortOptions={sortOptions}
          filter={filter}
          onFilterChange={setFilter}
          onClear={handleClear}
        />
      </div>
      {filteredResults.length === 0 ? (
        <p className="text-center text-xl text-gray-300">No results match your filter.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {filteredResults.map((movie) => (
            <MovieCard key={movie.movie_id} movie={movie} style={{}} isInFilms={films.some(film => film.movie_id === movie.movie_id)} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;
