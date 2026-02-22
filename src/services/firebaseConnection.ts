import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyAbotLCgK-Na60h3zVQi2kOFxxrBvTJAnw',
  authDomain: 'cursoapp-b0f7f.firebaseapp.com',
  projectId: 'cursoapp-b0f7f',
  storageBucket: 'cursoapp-b0f7f.firebasestorage.app',
  messagingSenderId: '582879995682',
  appId: '1:582879995682:web:7565c1a2fed3c5f538e77b',
  measurementId: 'G-L64P4RM787',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };
