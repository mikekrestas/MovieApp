// src/App.tsx
import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate, useParams } from 'react-router-dom';
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
import RecommendationsPage from './pages/RecommendationsPage';
import BuddiesPage from './pages/BuddiesPage';
import BuddyProfilePage from './pages/BuddyProfilePage';
import ChooseUsernamePage from './pages/ChooseUsernamePage';
import { auth, db } from './firebase';
import { getFavorites, getFilms, searchUsersByUsername } from './services/authService';
import { searchMovies, fetchLatestMovies } from './services/movieService';
import { getDoc, doc } from 'firebase/firestore';
import { Movie } from './types/types';
import { User } from 'firebase/auth';
import 'bootstrap/dist/css/bootstrap.min.css';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [films, setFilms] = useState<Movie[]>([]);
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchType, setSearchType] = useState<'movie' | 'user'>('movie');
  const [userResults, setUserResults] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        // Check for username
        const userRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userRef);
        if (!userDoc.exists() || !userDoc.data()?.username) {
          navigate('/choose-username');
          return;
        }
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
  }, [navigate]);

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

  const handleSearch = async (query: string, type: 'movie' | 'user') => {
    setSearchType(type);
    if (type === 'movie') {
      try {
        const results = await searchMovies(query);
        setSearchResults(results);
        setUserResults([]);
        navigate('/search');
      } catch (error) {
        console.error('Error searching movies:', error);
      }
    } else if (type === 'user') {
      try {
        const results = await searchUsersByUsername(query, user?.uid);
        setUserResults(results);
        setSearchResults([]);
        navigate('/search');
      } catch (error) {
        console.error('Error searching users:', error);
      }
    }
  };

  // Wrapper components for dynamic userId routes
  const BuddyFavoritesPage = () => {
    const { userId } = useParams();
    return <FavoritesPage userId={userId || ''} readOnly={true} />;
  };
  const BuddyWatchlistPage = () => {
    const { userId } = useParams();
    return <WatchlistPage userId={userId || ''} readOnly={true} />;
  };
  const BuddyFilmsPage = () => {
    const { userId } = useParams();
    return <FilmsPage userId={userId || ''} readOnly={true} />;
  };
  const BuddyBuddiesPage = () => {
    const { userId } = useParams();
    return <BuddiesPage userId={userId || ''} readOnly={true} />;
  };

  return (
    <>
      <Header onSearch={handleSearch} user={user} />
      <Routes>
        <Route path="/" element={<HomePage movies={movies} user={user} favorites={favorites} setFavorites={setFavorites} films={films} />} />
        <Route path="/favorites" element={<FavoritesPage userId={user?.uid || ''} />} />
        <Route path="/movie/:id" element={<MovieDetailPage user={user} favorites={favorites} setFavorites={setFavorites} movies={movies} searchResults={searchResults} films={films} />} />
        <Route path="/search" element={<SearchResultsPage user={user} searchResults={searchResults} films={films} searchType={searchType} userResults={userResults} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<ProfilePage user={user} />} />
        <Route path="/profile/:userId" element={<BuddyProfilePage />} />
        <Route path="/profile/:userId/favorites" element={<BuddyFavoritesPage />} />
        <Route path="/profile/:userId/watchlist" element={<BuddyWatchlistPage />} />
        <Route path="/profile/:userId/films" element={<BuddyFilmsPage />} />
        <Route path="/profile/:userId/buddies" element={<BuddyBuddiesPage />} />
        <Route path="/watchlist" element={<WatchlistPage userId={user?.uid || ''} />} />
        <Route path="/films" element={<FilmsPage userId={user?.uid || ''} />} />
        <Route path="/recommendations" element={<RecommendationsPage user={user} />} />
        <Route path="/buddies" element={<BuddiesPage userId={user?.uid || ''} />} />
        <Route path="/choose-username" element={<ChooseUsernamePage />} />
      </Routes>
    </>
  );
};

export default App;
