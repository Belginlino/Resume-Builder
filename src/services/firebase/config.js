import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDemoConfigKeyForOfflineUsageMode123",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "careerforge-ats.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "careerforge-ats",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "careerforge-ats.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789012:web:demo123456789012"
};

// Check if valid Firebase configuration is provided
export const isFirebaseConfigured = Boolean(
  import.meta.env.VITE_FIREBASE_API_KEY && 
  import.meta.env.VITE_FIREBASE_PROJECT_ID
);

let app, auth, db, storage, googleProvider;

try {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  googleProvider = new GoogleAuthProvider();
} catch (error) {
  console.warn("Firebase initialized in offline/demo fallback mode:", error);
}

export { app, auth, db, storage, googleProvider };
