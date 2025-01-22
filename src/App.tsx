import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import FavoritesPage from './pages/FavoritesPage';
import MovieDetailPage from './pages/MovieDetailPage';
import SearchResultsPage from './pages/SearchResultsPage';
import SignUp from './components/SignUp';
import Login from './components/Login';
import ProfilePage from './pages/ProfilePage';
import WatchlistPage from './pages/WatchlistPage';
import FilmsPage from './pages/FilmsPage'; // Import FilmsPage
import { auth } from './firebase';
import { getFavorites, getFilms } from './services/authService';
import { searchMovies } from './services/movieService'; // Keep for search functionality
import { fetchLatestMovies } from './services/movieService'; // Use this for latest movies from TMDB
import { Movie } from './types/types';
import { User } from 'firebase/auth';
import 'bootstrap/dist/css/bootstrap.min.css';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [films, setFilms] = useState<Movie[]>([]); // Add state for films
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]); // Store latest movies here
  const navigate = useNavigate();

  // Fetch user info and favorites
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const favorites = await getFavorites(firebaseUser.uid);
        setFavorites(favorites);
        const films = await getFilms(firebaseUser.uid); // Fetch films
        setFilms(films);
      } else {
        setFavorites([]);
        setFilms([]); // Clear films if no user
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch latest movies from TMDB (instead of OMDb)
  useEffect(() => {
    const fetchAndSetMovies = async () => {
      try {
        const latestMovies = await fetchLatestMovies(); // Fetch movies from TMDB
        setMovies(latestMovies);
      } catch (error) {
        console.error('Error fetching latest movies:', error);
      }
    };
    fetchAndSetMovies();
  }, []);

  // Search function
  const handleSearch = async (query: string) => {
    if (query) {
      try {
        const results = await searchMovies(query);
        setSearchResults(results);
        navigate('/search'); // Navigate to the search results page
      } catch (error) {
        console.error('Error searching movies:', error);
      }
    }
  };

  return (
    <>
      <Header onSearch={handleSearch} user={user} />
      <Routes>
        <Route path="/" element={<HomePage movies={movies} 
  user={user} 
  favorites={favorites} 
  setFavorites={setFavorites} 
  films={films} />} />
        <Route path="/" element={<HomePage movies={movies} user={user} favorites={favorites} setFavorites={setFavorites} films={films} />} />
        <Route path="/favorites" element={<FavoritesPage user={user} favorites={favorites} setFavorites={setFavorites} films={films} />} />
        <Route path="/movie/:id" element={<MovieDetailPage user={user} favorites={favorites} setFavorites={setFavorites} movies={movies} searchResults={searchResults}/>} />
        <Route path="/search" element={<SearchResultsPage user={user} searchResults={searchResults} films={films}/>} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/watchlist" element={<WatchlistPage user={user} />} />
        <Route path="/profile" element={<ProfilePage user={user} />} />
        <Route path="/films" element={<FilmsPage user={user} />} />
      </Routes>
    </>
  );
};

export default App;
