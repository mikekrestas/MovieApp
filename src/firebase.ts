// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA7Eo_76_209XtgmWSstngWLBzG24oCBQ0",
  authDomain: "movieapp-b186b.firebaseapp.com",
  projectId: "movieapp-b186b",
  storageBucket: "movieapp-b186b.appspot.com",
  messagingSenderId: "200851853423",
  appId: "1:200851853423:web:76b5cd32a2b7b145bd7d9a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);

enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.log("Failed to enable offline persistence: multiple tabs open");
  } else if (err.code === 'unimplemented') {
    console.log("Offline persistence is not supported by the browser");
  }
});

export { auth, googleProvider, db };