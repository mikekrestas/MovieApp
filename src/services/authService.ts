// src/services/authService.ts
import { auth, db, storage } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut as firebaseSignOut, UserCredential, GoogleAuthProvider, signInWithPopup, User, updateProfile as firebaseUpdateProfile } from 'firebase/auth';
import { doc, setDoc, collection, getDocs, getDoc, deleteDoc } from 'firebase/firestore';
import { Movie } from '../types/types';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';


const validateMovie = (movie: Partial<Movie>): Movie => {
  if (!movie.movie_id || movie.movie_id.trim() === '') {
    throw new Error('Invalid IMDb ID.');
  }
  
  return {
    movie_id: movie.movie_id,
    title: movie.title || 'No Title',
    description: movie.description || 'No Description',
    releaseDate: movie.releaseDate || 'Unknown',
    posterPath: movie.posterPath || '',
    genre: movie.genre || 'No Genre',
    director: movie.director || 'No Director',
    actors: movie.actors || 'No Actors',
    runtime: movie.runtime || 'No Runtime',
    rating: movie.rating || 'No Rating',
    language: movie.language || 'No Language',
    country: movie.country || 'No Country',
    imdbRating: movie.imdbRating || 'No IMDb Rating',
    boxOffice: movie.boxOffice || 'No Box Office Data',
    production: movie.production || 'No Production Data',
  };
};

export const addFavorite = async (userId: string, movie: Partial<Movie>) => {
  const validMovie = validateMovie(movie);
  console.log('Adding favorite movie:', validMovie);
  try {
    const movieRef = doc(db, 'users', userId, 'favorites', validMovie.movie_id);
    await setDoc(movieRef, validMovie);
    console.log('Movie added to favorites successfully.');
  } catch (error) {
    console.error('Error adding movie to favorites:', error);
  }
};

export const removeFavorite = async (userId: string, movieId: string) => {
  const movieRef = doc(db, 'users', userId, 'favorites', movieId);
  await deleteDoc(movieRef);
};

export const getFavorites = async (userId: string): Promise<Movie[]> => {
  console.log('Fetching favorites for user:', userId);
  try {
    const favoritesRef = collection(db, 'users', userId, 'favorites');
    const favoritesSnapshot = await getDocs(favoritesRef);
    const favorites: Movie[] = [];
    
    favoritesSnapshot.forEach((doc) => {
      favorites.push(doc.data() as Movie);
    });

    console.log('Favorites fetched successfully:', favorites);
    return favorites;
  } catch (error) {
    console.error('Error fetching favorites:', error);
    throw error;
  }
};

// Function to add a movie to the watchlist
export const addWatchlist = async (userId: string, movie: Partial<Movie>) => {
  const validMovie = validateMovie(movie);
  console.log('Adding movie to watchlist:', validMovie);
  try {
    const movieRef = doc(db, 'users', userId, 'watchlist', validMovie.movie_id);
    await setDoc(movieRef, validMovie);
    console.log('Movie added to watchlist successfully.');
  } catch (error) {
    console.error('Error adding movie to watchlist:', error);
  }
};

// Function to remove a movie from the watchlist
export const removeWatchlist = async (userId: string, movieId: string) => {
  const movieRef = doc(db, 'users', userId, 'watchlist', movieId);
  await deleteDoc(movieRef);
};

// Function to get the watchlist
export const getWatchlist = async (userId: string): Promise<Movie[]> => {
  console.log('Fetching watchlist for user:', userId);
  try {
    const watchlistRef = collection(db, 'users', userId, 'watchlist');
    const snapshot = await getDocs(watchlistRef);
    const movies: Movie[] = [];
    snapshot.forEach(doc => {
      movies.push(doc.data() as Movie);
    });
    console.log('Watchlist fetched successfully:', movies);
    return movies;
  } catch (error) {
    console.error('Error fetching watchlist:', error);
    throw error;
  }
};

export const addFilm = async (userId: string, movie: Partial<Movie>) => {
  const validMovie = validateMovie(movie);
  console.log('Adding film:', validMovie);
  try {
    const movieRef = doc(db, 'users', userId, 'films', validMovie.movie_id);
    await setDoc(movieRef, validMovie);
    console.log('Movie added to films successfully.');
  } catch (error) {
    console.error('Error adding movie to films:', error);
  }
};

export const removeFilm = async (userId: string, movieId: string) => {
  const movieRef = doc(db, 'users', userId, 'films', movieId);
  await deleteDoc(movieRef);
};

export const getFilms = async (userId: string): Promise<Movie[]> => {
  console.log('Fetching films for user:', userId);
  try {
    const filmsRef = collection(db, 'users', userId, 'films');
    const filmsSnapshot = await getDocs(filmsRef);
    const films: Movie[] = [];
    filmsSnapshot.forEach((doc) => {
      films.push(doc.data() as Movie);
    });
  
    return films;
  } catch (error) {
    console.error('Error fetching films:', error);
    throw error;
  }
};

// Add this utility function to check for existing users
const checkUserExists = async (username: string, email: string) => {
  const userDoc = doc(db, 'users', username);
  const emailDoc = await getDoc(doc(db, 'emails', email)); // Assuming you have a separate collection for emails

  const userExists = (await getDoc(userDoc)).exists();
  const emailExists = emailDoc.exists();

  return { userExists, emailExists };
};

export const signUp = async (username: string, email: string, password: string): Promise<UserCredential> => {
  const { userExists, emailExists } = await checkUserExists(username, email);

  if (userExists) {
    throw new Error('Username already taken. Please choose another one.');
  }

  if (emailExists) {
    throw new Error('Email is already in use. Please choose another one.');
  }

  // Create user with email and password
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Save username in Firestore under the user's document
  await setDoc(doc(db, 'users', user.uid), {
    username,
    email,
    // You can add other user fields here
  });

  // Optionally, save the email separately if needed
  await setDoc(doc(db, 'emails', email), { uid: user.uid });

  return userCredential;
};

export const login = async (identifier: string, password: string): Promise<UserCredential> => {
  // Use email if identifier looks like an email
  if (identifier.includes('@')) {
    return signInWithEmailAndPassword(auth, identifier, password);
  } else {
    // Handle login using username (implement the logic to retrieve user by username)
    const userDoc = await getDoc(doc(db, 'users', identifier));
    if (userDoc.exists()) {
      const userEmail = userDoc.data().email; // assuming you stored the email with username
      return signInWithEmailAndPassword(auth, userEmail, password);
    } else {
      throw new Error('User not found');
    }
  }
};

export const loginWithGoogle = async (): Promise<User | null> => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    // Log the user object and photoURL
    console.log('Logged in User:', user);
    console.log('Google User Photo URL:', user.photoURL);
    
    return user;
  } catch (error) {
    console.error('Error during Google login:', error);
    return null;
  }
};

export const logout = (): Promise<void> => {
  return firebaseSignOut(auth);
};

export const updateProfilePicture = async (user: User, file: File): Promise<string> => {
  if (!user) {
    throw new Error('No user is logged in');
  }

  // Create a reference to the file in Firebase Storage
  const fileRef = ref(storage, `profile_pictures/${user.uid}/${file.name}`);
  
  // Upload the file
  await uploadBytes(fileRef, file);

  // Get the download URL
  const photoURL = await getDownloadURL(fileRef);

  // Update the user's profile
  await firebaseUpdateProfile(user, { photoURL });

  return photoURL;
};