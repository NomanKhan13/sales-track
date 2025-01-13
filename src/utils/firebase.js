// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAkPMVvoCNSwCzSWBCa4h9IalKU64fLPYI',
  authDomain: 'maa-shakti-fireworks.firebaseapp.com',
  projectId: 'maa-shakti-fireworks',
  storageBucket: 'maa-shakti-fireworks.firebasestorage.app',
  messagingSenderId: '648003914896',
  appId: '1:648003914896:web:a7130d2dd70033acbf9c15',
  measurementId: 'G-PDQSPJ6YE0',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

const analytics = getAnalytics(app);
