// src/App.tsx
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
import FilmsPage from './pages/FilmsPage';
import RecommendationsPage from './pages/RecommendationsPage'; // Import RecommendationsPage
import { auth } from './firebase';
import { getFavorites, getFilms } from './services/authService';
import { searchMovies, fetchLatestMovies } from './services/movieService';
import { Movie } from './types/types';
import { User } from 'firebase/auth';
import 'bootstrap/dist/css/bootstrap.min.css';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [films, setFilms] = useState<Movie[]>([]);
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const favorites = await getFavorites(firebaseUser.uid);
        setFavorites(favorites);
        const films = await getFilms(firebaseUser.uid);
        setFilms(films);
      } else {
        setFavorites([]);
        setFilms([]);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchAndSetMovies = async () => {
      try {
        const latestMovies = await fetchLatestMovies();
        setMovies(latestMovies);
      } catch (error) {
        console.error('Error fetching latest movies:', error);
      }
    };
    fetchAndSetMovies();
  }, []);

  const handleSearch = async (query: string) => {
    if (query) {
      try {
        const results = await searchMovies(query);
        setSearchResults(results);
        navigate('/search');
      } catch (error) {
        console.error('Error searching movies:', error);
      }
    }
  };

  return (
    <>
      <Header onSearch={handleSearch} user={user} />
      <Routes>
        <Route path="/" element={<HomePage movies={movies} user={user} favorites={favorites} setFavorites={setFavorites} films={films} />} />
        <Route path="/favorites" element={<FavoritesPage user={user} favorites={favorites} setFavorites={setFavorites} films={films} />} />
        <Route path="/movie/:id" element={<MovieDetailPage user={user} favorites={favorites} setFavorites={setFavorites} movies={movies} searchResults={searchResults} films={films} />} />
        <Route path="/search" element={<SearchResultsPage user={user} searchResults={searchResults} films={films} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<ProfilePage user={user} />} />
        <Route path="/watchlist" element={<WatchlistPage user={user} />} />
        <Route path="/films" element={<FilmsPage user={user} />} />
        <Route path="/recommendations" element={<RecommendationsPage user={user} />} /> {/* Add route for RecommendationsPage */}
      </Routes>
    </>
  );
};

export default App;
