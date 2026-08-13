import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from './config';

// Local storage key for demo user persistence
const DEMO_USER_KEY = 'careerforge_demo_user';

export const authService = {
  // Register user
  register: async (email, password, displayName) => {
    if (isFirebaseConfigured && auth) {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (displayName) {
        await updateProfile(userCredential.user, { displayName });
      }
      return userCredential.user;
    } else {
      // Local demo fallback
      const mockUser = {
        uid: 'demo_user_' + Date.now(),
        email,
        displayName: displayName || email.split('@')[0],
        photoURL: null,
        isDemo: true
      };
      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(mockUser));
      return mockUser;
    }
  },

  // Login user
  login: async (email, password) => {
    if (isFirebaseConfigured && auth) {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } else {
      // Local demo fallback
      const mockUser = {
        uid: 'demo_user_12345',
        email,
        displayName: email.split('@')[0] || 'Alex Morgan',
        photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
        isDemo: true
      };
      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(mockUser));
      return mockUser;
    }
  },

  // Google Sign-In
  loginWithGoogle: async () => {
    if (isFirebaseConfigured && auth) {
      const userCredential = await signInWithPopup(auth, googleProvider);
      return userCredential.user;
    } else {
      const mockUser = {
        uid: 'google_user_9999',
        email: 'alex.morgan@example.com',
        displayName: 'Alex Morgan',
        photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
        isDemo: true
      };
      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(mockUser));
      return mockUser;
    }
  },

  // Reset password
  resetPassword: async (email) => {
    if (isFirebaseConfigured && auth) {
      await sendPasswordResetEmail(auth, email);
    } else {
      return true;
    }
  },

  // Sign out
  logout: async () => {
    if (isFirebaseConfigured && auth) {
      await firebaseSignOut(auth);
    }
    localStorage.removeItem(DEMO_USER_KEY);
  },

  // Get current stored demo user
  getDemoUser: () => {
    try {
      const saved = localStorage.getItem(DEMO_USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  }
};
