// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAW9g_UpzSwCN8H-Sb8PyM-foOWUif_B64",
  authDomain: "chat-app-682f2.firebaseapp.com",
  projectId: "chat-app-682f2",
  storageBucket: "chat-app-682f2.appspot.com",
  messagingSenderId: "612546724387",
  appId: "1:612546724387:web:1e7296480dfbaacede2796",
  measurementId: "G-WP4DKJSSP5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);

// connectAuthEmulator(auth, "http://localhost:9099");
// connectFirestoreEmulator(db, 'localhost', 8080);

export {app, db}
