import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../services/firebase/config';
import { authService } from '../services/firebase/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          setUser(firebaseUser);
        } else {
          // Check local demo user if any
          const demoUser = authService.getDemoUser();
          setUser(demoUser);
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      // Local fallback mode
      const demoUser = authService.getDemoUser();
      if (!demoUser) {
        // Auto-initialize default demo user for frictionless instant testing
        const defaultUser = {
          uid: 'demo_user_alex',
          email: 'alex.morgan@example.com',
          displayName: 'Alex Morgan',
          photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
          isDemo: true
        };
        localStorage.setItem('careerforge_demo_user', JSON.stringify(defaultUser));
        setUser(defaultUser);
      } else {
        setUser(demoUser);
      }
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const loggedUser = await authService.login(email, password);
      setUser(loggedUser);
      return loggedUser;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, displayName) => {
    setLoading(true);
    try {
      const newUser = await authService.register(email, password, displayName);
      setUser(newUser);
      return newUser;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const googleUser = await authService.loginWithGoogle();
      setUser(googleUser);
      return googleUser;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const resetPassword = async (email) => {
    await authService.resetPassword(email);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      loginWithGoogle,
      logout,
      resetPassword,
      isAuthenticated: Boolean(user)
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
