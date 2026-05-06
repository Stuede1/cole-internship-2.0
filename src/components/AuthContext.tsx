'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, googleProvider } from '@/firebase';
import { 
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  User
} from 'firebase/auth';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; user?: User; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; user?: User; error?: string }>;
  logout: () => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string) => Promise<{ success: boolean; user?: User; error?: string }>;
  error: string;
  setError: (error: string) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Sign up function
  async function signup(email: string, password: string) {
    try {
      setError('');
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user document in Firestore
      const { createUserDocument } = await import('@/firebase');
      await createUserDocument(result.user);
      
      return { success: true, user: result.user };
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  }

  // Login function
  async function login(email: string, password: string) {
    try {
      setError('');
      const result = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: result.user };
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  }

  // Google login function
  async function loginWithGoogle() {
    try {
      setError('');
      const result = await signInWithPopup(auth, googleProvider);
      
      // Create user document in Firestore (doesn't overwrite if exists)
      const { createUserDocument } = await import('@/firebase');
      await createUserDocument(result.user);
      
      return { success: true, user: result.user };
    } catch (err: any) {
      // Handle popup-related errors specifically
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in popup was closed');
      } else if (err.code === 'auth/popup-blocked') {
        setError('Sign-in popup was blocked by the browser. Please allow popups for this site.');
      } else {
        setError(err.message);
      }
      return { success: false, error: err.message };
    }
  }

  // Logout function
  async function logout() {
    try {
      setError('');
      await signOut(auth);
      return { success: true };
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  }

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    login,
    loginWithGoogle,
    logout,
    signup,
    error,
    setError,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
