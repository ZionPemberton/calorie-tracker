// src/lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA4exTDyzAf-gPrk_mT_GlT9uF4MbU2h38",
  authDomain: "calorie-counter-12bbe.firebaseapp.com",
  projectId: "calorie-counter-12bbe",
  storageBucket: "calorie-counter-12bbe.firebasestorage.app",
  messagingSenderId: "945965231152",
  appId: "1:945965231152:web:9e88b1314f8bac545891f5",
  measurementId: "G-Q82PCK51JL"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
