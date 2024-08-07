// src/services/authService.ts
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut as firebaseSignOut, UserCredential, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { Movie } from '../types';

const validateMovie = (movie: Partial<Movie>): Movie => {
  return {
    id: movie.id || '',
    title: movie.title || 'No Title',
    description: movie.description || 'No Description',
    releaseDate: movie.releaseDate || 'Unknown',
    posterPath: movie.posterPath || '',
  };
};

export const addFavorite = async (userId: string, movie: Partial<Movie>) => {
  const validMovie = validateMovie(movie);
  console.log('Adding favorite movie:', validMovie);
  try {
    const movieRef = doc(db, 'users', userId, 'favorites', validMovie.id);
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
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      console.log('Favorites fetched successfully:', userDoc.data().favorites);
      return userDoc.data().favorites || [];
    } else {
      console.log('No favorites found.');
      return [];
    }
  } catch (error) {
    console.error('Error fetching favorites:', error);
    throw error;
  }
};

export const signUp = (email: string, password: string): Promise<UserCredential> => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const login = (email: string, password: string): Promise<UserCredential> => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const loginWithGoogle = (): Promise<UserCredential> => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};

export const logout = (): Promise<void> => {
  return firebaseSignOut(auth);
};
