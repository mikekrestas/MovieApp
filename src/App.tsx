import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom'; // Use navigate here
import Header from './components/Header';
import HomePage from './pages/HomePage';
import FavoritesPage from './pages/FavoritesPage';
import MovieDetailPage from './pages/MovieDetailPage';
import SearchResultsPage from './pages/SearchResultsPage';
import SignUp from './components/SignUp';
import Login from './components/Login';
import ProfilePage from './pages/ProfilePage';
import WatchlistPage from './pages/WatchlistPage';
import { auth } from './firebase';
import { getFavorites } from './services/authService';
import { fetchMovies, searchMovies } from './services/movieService';
import { Movie } from './types/types';
import { User } from 'firebase/auth';
import 'bootstrap/dist/css/bootstrap.min.css';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const navigate = useNavigate(); // Call useNavigate here

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const favorites = await getFavorites(firebaseUser.uid);
        setFavorites(favorites);
      } else {
        setFavorites([]);
      }
    });
    return () => unsubscribe();
  }, []);  

  useEffect(() => {
    const fetchAndSetMovies = async () => {
      try {
        const moviesList = await fetchMovies();
        setMovies(moviesList);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };
    fetchAndSetMovies();
  }, []);

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
        <Route path="/" element={<HomePage user={user} favorites={favorites} setFavorites={setFavorites} movies={movies} />} />
        <Route path="/favorites" element={<FavoritesPage user={user} favorites={favorites} setFavorites={setFavorites} />} />
        <Route path="/movie/:id" element={<MovieDetailPage user={user} favorites={favorites} setFavorites={setFavorites} movies={movies} />} />
        <Route path="/search" element={<SearchResultsPage searchResults={searchResults} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/watchlist" element={<WatchlistPage user={user} />} />
        <Route path="/profile" element={<ProfilePage user={user} />} />
      </Routes>
    </>
  );
};

export default App;
