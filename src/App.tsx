// src/App.tsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import FavoritesPage from './pages/FavoritesPage';
import MovieDetailPage from './pages/MovieDetailPage';
import SignUp from './components/SignUp';
import Login from './components/Login';
import ProfilePage from './pages/ProfilePage';
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
        console.log('Fetching movies in App component...');
        const moviesList = await fetchMovies();
        setMovies(moviesList);
        console.log('Fetched movies:', moviesList);
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
      } catch (error) {
        console.error('Error searching movies:', error);
      }
    }
  };

  return (
    <Router>
      <Header onSearch={handleSearch} user={user} />
      <Routes>
        <Route path="/" element={<HomePage user={user} favorites={favorites} setFavorites={setFavorites} searchResults={searchResults} movies={movies} />} />
        <Route path="/favorites" element={<FavoritesPage user={user} favorites={favorites} setFavorites={setFavorites} />} />
        <Route path="/movie/:id" element={<MovieDetailPage user={user} favorites={favorites} setFavorites={setFavorites} movies={movies} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<ProfilePage user={user} />} />
      </Routes>
    </Router>
  );
};

export default App;
