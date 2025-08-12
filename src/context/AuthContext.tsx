"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';

interface User {
  id: string;
  aud: string;
  role: string;
  email?: string;
  fullName?: string;
  status?: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Cookie utility functions
const setCookie = (name: string, value: string, days: number = 7) => {
  if (typeof document === 'undefined') return;
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
};

const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

const deleteCookie = (name: string) => {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check for existing authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Wait for client-side hydration
        if (typeof window === 'undefined') return;
        
        const token = getCookie('auth_token');
        const userData = localStorage.getItem('user_data');
        
        console.log('Checking auth - Token:', token, 'User data:', userData); // Debug log
        
        if (token && userData) {
          try {
            const user = JSON.parse(userData);
            console.log('Found stored user data, restoring session:', user); // Debug log
            setUser(user);
          } catch (parseError) {
            console.error('Error parsing user data:', parseError);
            // Only clear data if it's actually corrupted, not just missing
            if (userData && userData !== 'null' && userData !== 'undefined') {
              deleteCookie('auth_token');
              localStorage.removeItem('user_data');
            }
          }
        } else {
          console.log('No valid authentication found'); // Debug log
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        // Only clear data for specific authentication errors, not general errors
        if (error instanceof Error && error.message.includes('Authentication error')) {
          deleteCookie('auth_token');
          localStorage.removeItem('user_data');
        }
      } finally {
        setIsLoading(false);
      }
    };

    // Add a small delay to ensure client-side hydration is complete
    const timer = setTimeout(checkAuth, 100);
    return () => clearTimeout(timer);
  }, []);

  const login = (userData: User, token: string) => {
    console.log('Logging in user:', userData, 'with token:', token); // Debug log
    setUser(userData);
    setCookie('auth_token', token, 7); // 7 days
    localStorage.setItem('user_data', JSON.stringify(userData));
  };

  const logout = () => {
    console.log('Logging out user'); // Debug log
    setUser(null);
    deleteCookie('auth_token');
    localStorage.removeItem('user_data');
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
