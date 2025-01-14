import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { setLogLevel } from "firebase/app";
import { getDatabase } from "firebase/database";

// Initialize Realtime Database


const firebaseConfig = {
  apiKey: "AIzaSyAkPMVvoCNSwCzSWBCa4h9IalKU64fLPYI",
  authDomain: "maa-shakti-fireworks.firebaseapp.com",
  databaseURL: "https://maa-shakti-fireworks-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "maa-shakti-fireworks",
  storageBucket: "maa-shakti-fireworks.firebasestorage.app",
  messagingSenderId: "648003914896",
  appId: "1:648003914896:web:a7130d2dd70033acbf9c15",
  measurementId: "G-PDQSPJ6YE0"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Set Firebase debug log level
setLogLevel("debug");

// Initialize auth
const auth = getAuth(app);

// Initialize Firestore
// const db = getFirestore(app);
const db = getDatabase(app);

export { auth, db };