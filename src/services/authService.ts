// src/services/authService.ts
import { auth, db, storage } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut as firebaseSignOut, UserCredential, GoogleAuthProvider, signInWithPopup, User, updateProfile as firebaseUpdateProfile } from 'firebase/auth';
import { doc, setDoc, collection, getDocs, getDoc, deleteDoc, addDoc, query, orderBy, where } from 'firebase/firestore';
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
  try {
    const movieRef = doc(db, 'users', userId, 'favorites', validMovie.movie_id);
    await setDoc(movieRef, validMovie);
  } catch (error) {
    console.error('Error adding movie to favorites:', error);
  }
};

export const removeFavorite = async (userId: string, movieId: string) => {
  const movieRef = doc(db, 'users', userId, 'favorites', movieId);
  await deleteDoc(movieRef);
};

export const getFavorites = async (userId: string): Promise<Movie[]> => {
  try {
    const favoritesRef = collection(db, 'users', userId, 'favorites');
    const favoritesSnapshot = await getDocs(favoritesRef);
    const favorites: Movie[] = [];
    
    favoritesSnapshot.forEach((doc) => {
      favorites.push(doc.data() as Movie);
    });

    return favorites;
  } catch (error) {
    console.error('Error fetching favorites:', error);
    throw error;
  }
};

// Function to add a movie to the watchlist
export const addWatchlist = async (userId: string, movie: Partial<Movie>) => {
  const validMovie = validateMovie(movie);
  try {
    const movieRef = doc(db, 'users', userId, 'watchlist', validMovie.movie_id);
    await setDoc(movieRef, validMovie);
  } catch (error) {
  }
};

// Function to remove a movie from the watchlist
export const removeWatchlist = async (userId: string, movieId: string) => {
  const movieRef = doc(db, 'users', userId, 'watchlist', movieId);
  await deleteDoc(movieRef);
};

// Function to get the watchlist
export const getWatchlist = async (userId: string): Promise<Movie[]> => {
  try {
    const watchlistRef = collection(db, 'users', userId, 'watchlist');
    const snapshot = await getDocs(watchlistRef);
    const movies: Movie[] = [];
    snapshot.forEach(doc => {
      movies.push(doc.data() as Movie);
    });
    return movies;
  } catch (error) {
    console.error('Error fetching watchlist:', error);
    throw error;
  }
};

export const addFilm = async (userId: string, movie: Partial<Movie>) => {
  const validMovie = validateMovie(movie);
  try {
    const movieRef = doc(db, 'users', userId, 'films', validMovie.movie_id);
    await setDoc(movieRef, validMovie);
  } catch (error) {
    console.error('Error adding movie to films:', error);
  }
};

export const removeFilm = async (userId: string, movieId: string) => {
  const movieRef = doc(db, 'users', userId, 'films', movieId);
  await deleteDoc(movieRef);
};

export const getFilms = async (userId: string): Promise<Movie[]> => {
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
  // Username uniqueness check (case-insensitive)
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('username', '==', username.trim().toLowerCase()));
  const snapshot = await getDocs(q);
  if (!username.match(/^[a-z0-9_]{3,20}$/)) {
    throw new Error('Username must be 3-20 characters, lowercase letters, numbers, or underscores.');
  }
  if (!snapshot.empty) {
    throw new Error('Username already taken. Please choose another one.');
  }
  // Email uniqueness check (existing logic)
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

export const setRating = async (userId: string, movieId: string, rating: number) => {
  const ratingRef = doc(db, 'users', userId, 'ratings', movieId);
  await setDoc(ratingRef, { rating }, { merge: true });
};

export const getRating = async (userId: string, movieId: string): Promise<number | null> => {
  const ratingRef = doc(db, 'users', userId, 'ratings', movieId);
  const ratingSnap = await getDoc(ratingRef);
  if (ratingSnap.exists()) {
    return ratingSnap.data().rating ?? null;
  }
  return null;
};

// --- Reviews ---
export interface Review {
  userId: string;
  username: string;
  movieId: string;
  reviewText: string;
  timestamp: number;
  reactions?: Record<string, string[]>;
  id?: string;
}

export const addReview = async (movieId: string, review: Review) => {
  try {
    const reviewsRef = collection(db, 'movies', movieId, 'reviews');
    await addDoc(reviewsRef, review);
  } catch (error) {
    console.error('Error adding review:', error);
    throw error;
  }
};

export const getReviews = async (movieId: string): Promise<Review[]> => {
  try {
    const reviewsRef = collection(db, 'movies', movieId, 'reviews');
    const q = query(reviewsRef, orderBy('timestamp', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }) as Review);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
};

export const reactToReview = async (movieId: string, reviewId: string, emoji: string, userId: string) => {
  try {
    const reviewRef = doc(db, 'movies', movieId, 'reviews', reviewId);
    const reviewSnap = await getDoc(reviewRef);
    if (!reviewSnap.exists()) return;
    const review = reviewSnap.data() as Review;
    const reactions = { ...(review.reactions || {}) };
    const users = new Set(reactions[emoji] || []);
    if (users.has(userId)) {
      users.delete(userId); // remove reaction
    } else {
      users.add(userId); // add reaction
    }
    reactions[emoji] = Array.from(users);
    await setDoc(reviewRef, { reactions }, { merge: true });
  } catch (error) {
    console.error('Error reacting to review:', error);
    throw error;
  }
};

export const deleteReview = async (movieId: string, reviewId: string) => {
  try {
    const reviewRef = doc(db, 'movies', movieId, 'reviews', reviewId);
    await deleteDoc(reviewRef);
  } catch (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
};

// --- Buddy System ---
export interface BuddyRequest {
  from: string; // userId
  fromUsername?: string; // sender's username
  to: string;   // userId
  status: 'pending' | 'accepted' | 'rejected';
  timestamp: number;
  id?: string;
}

export interface Buddy {
  userId: string;
  since: number;
}

export interface UserProfile {
  userId: string;
  username: string;
  email: string;
  photoURL?: string;
}

// Search users by username (case-insensitive, partial match)
export const searchUsersByUsername = async (query: string, excludeUserId?: string): Promise<UserProfile[]> => {
  const usersRef = collection(db, 'users');
  const snapshot = await getDocs(usersRef);
  return snapshot.docs
    .map(doc => ({ userId: doc.id, ...doc.data() } as UserProfile))
    .filter(u =>
      u.username &&
      u.username.toLowerCase().includes(query.toLowerCase()) &&
      (!excludeUserId || u.userId !== excludeUserId)
    );
};

// Send a buddy request
export const sendBuddyRequest = async (from: string, to: string) => {
  // Fetch sender's username
  const fromUserDoc = await getDoc(doc(db, 'users', from));
  const fromUsername = fromUserDoc.exists() ? fromUserDoc.data().username : undefined;
  const req: BuddyRequest = { from, fromUsername, to, status: 'pending', timestamp: Date.now() };
  const reqRef = collection(db, 'users', to, 'buddyRequests');
  // Check if a pending request already exists
  const snapshot = await getDocs(reqRef);
  const existingReq = snapshot.docs.find(doc => {
    const data = doc.data();
    return data.from === from && data.to === to && data.status === 'pending';
  });
  if (!existingReq) {
    await addDoc(reqRef, req);
    // Add notification only if not already present
    const notifRef = collection(db, 'users', to, 'notifications');
    const notifSnap = await getDocs(notifRef);
    const existingNotif = notifSnap.docs.find(doc => {
      const data = doc.data();
      return data.type === 'buddy_request' && data.from === from && data.to === to && data.status === 'pending';
    });
    if (!existingNotif) {
      await addDoc(notifRef, {
        type: 'buddy_request',
        from,
        fromUsername,
        to,
        timestamp: Date.now(),
        status: 'pending',
        read: false,
      });
    }
  }
};

// Accept a buddy request
export const acceptBuddyRequest = async (userId: string, requestId: string, from: string) => {
  // Update request status
  const reqRef = doc(db, 'users', userId, 'buddyRequests', requestId);
  await setDoc(reqRef, { status: 'accepted' }, { merge: true });
  // Add each other as buddies
  const now = Date.now();
  await setDoc(doc(db, 'users', userId, 'buddies', from), { userId: from, since: now });
  await setDoc(doc(db, 'users', from, 'buddies', userId), { userId, since: now });
  // Mark notification as read
  await markNotificationAsRead(userId, requestId);
};

// Reject a buddy request
export const rejectBuddyRequest = async (userId: string, requestId: string) => {
  const reqRef = doc(db, 'users', userId, 'buddyRequests', requestId);
  await setDoc(reqRef, { status: 'rejected' }, { merge: true });
  await markNotificationAsRead(userId, requestId);
};

// Cancel a buddy request (remove the pending request sent by 'from' to 'to')
export const cancelBuddyRequest = async (from: string, to: string) => {
  // Find the pending request from 'from' to 'to'
  const reqRef = collection(db, 'users', to, 'buddyRequests');
  const snapshot = await getDocs(reqRef);
  const reqDoc = snapshot.docs.find(doc => {
    const data = doc.data();
    return data.from === from && data.to === to && data.status === 'pending';
  });
  if (reqDoc) {
    await deleteDoc(doc(db, 'users', to, 'buddyRequests', reqDoc.id));
  }
  // Also remove the corresponding notification
  const notifRef = collection(db, 'users', to, 'notifications');
  const notifSnap = await getDocs(notifRef);
  const notifDoc = notifSnap.docs.find(doc => {
    const data = doc.data();
    return data.type === 'buddy_request' && data.from === from && data.to === to && data.status === 'pending';
  });
  if (notifDoc) {
    await deleteDoc(doc(db, 'users', to, 'notifications', notifDoc.id));
  }
};

// Get buddies for a user
export const getBuddies = async (userId: string): Promise<Buddy[]> => {
  const buddiesRef = collection(db, 'users', userId, 'buddies');
  const snapshot = await getDocs(buddiesRef);
  return snapshot.docs.map(doc => doc.data() as Buddy);
};

// Get pending buddy requests for a user
export const getBuddyRequests = async (userId: string): Promise<BuddyRequest[]> => {
  const reqRef = collection(db, 'users', userId, 'buddyRequests');
  const snapshot = await getDocs(reqRef);
  return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }) as BuddyRequest).filter(r => r.status === 'pending');
};

// Remove a buddy
export const removeBuddy = async (userId: string, buddyId: string) => {
  // Remove from both users' buddies collections
  await deleteDoc(doc(db, 'users', userId, 'buddies', buddyId));
  await deleteDoc(doc(db, 'users', buddyId, 'buddies', userId));
};

// --- Notifications ---
export interface Notification {
  type: 'buddy_request';
  from: string;
  fromUsername?: string; // sender's username
  to: string;
  timestamp: number;
  status: 'pending' | 'accepted' | 'rejected';
  read: boolean;
  id?: string;
}

export const addNotification = async (userId: string, notification: Notification) => {
  const notifRef = collection(db, 'users', userId, 'notifications');
  await addDoc(notifRef, notification);
};

export const getNotifications = async (userId: string): Promise<Notification[]> => {
  const notifRef = collection(db, 'users', userId, 'notifications');
  const snapshot = await getDocs(notifRef);
  return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }) as Notification);
};

export const markNotificationAsRead = async (userId: string, notificationId: string) => {
  const notifRef = doc(db, 'users', userId, 'notifications', notificationId);
  await setDoc(notifRef, { read: true }, { merge: true });
};