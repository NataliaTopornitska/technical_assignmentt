import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBKuYzLO9HRYNQDf4c64fsLPHgizSkhQW0',
  authDomain: 'maps-f1b72.firebaseapp.com',
  projectId: 'maps-f1b72',
  storageBucket: 'maps-f1b72.appspot.com',
  messagingSenderId: '742562332480',
  appId: '1:742562332480:web:07509bff594c5bc89404a5',
  measurementId: 'G-3NT31V65SN',
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { app, db };
