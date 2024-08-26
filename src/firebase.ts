// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDxYLnyr0pTH18Byy9sZg9k72Ay9L02gb4",
  authDomain: "movieapp-587e1.firebaseapp.com",
  projectId: "movieapp-587e1",
  storageBucket: "movieapp-587e1.appspot.com",
  messagingSenderId: "672009313338",
  appId: "1:672009313338:web:ab9696d42c3feb97cee903",
  measurementId: "G-JSS5S9PLQZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);

enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.log("Failed to enable offline persistence: multiple tabs open");
  } else if (err.code === 'unimplemented') {
    console.log("Offline persistence is not supported by the browser");
  }
});

export { auth, googleProvider, db, storage };