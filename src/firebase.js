// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics"; // Uncomment if you use analytics

const firebaseConfig = {
  apiKey: "AIzaSyAqCK07A6d6ejtg2XxzWNhA9gm3PsX0ghk",
  authDomain: "abacus-ccb35.firebaseapp.com",
  projectId: "abacus-ccb35",
  storageBucket: "abacus-ccb35.appspot.com",
  messagingSenderId: "682364075577",
  appId: "1:682364075577:web:44f61e7d090947464ed7e8",
  measurementId: "G-WJ499EKNWZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const firestore = getFirestore(app);

// Initialize Analytics and get a reference to the service (if needed)
// const analytics = getAnalytics(app);
