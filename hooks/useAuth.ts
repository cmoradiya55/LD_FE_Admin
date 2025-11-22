"use client";

import { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
}

interface AuthHook {
  authState: AuthState;
  login: (userData: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

export function useAuth(): AuthHook {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true
  });

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const savedAuth = localStorage.getItem('adminpro-auth');
        if (savedAuth) {
          const parsedAuth = JSON.parse(savedAuth);
          
          // Check if session is not expired (24 hours)
          const sessionAge = Date.now() - parsedAuth.timestamp;
          const sessionExpiry = 24 * 60 * 60 * 1000; // 24 hours in ms
          
          if (sessionAge < sessionExpiry) {
            setAuthState({
              isAuthenticated: true,
              user: parsedAuth.user,
              isLoading: false
            });
            return;
          } else {
            // Session expired, clear it
            localStorage.removeItem('adminpro-auth');
          }
        }
      } catch (error) {
        console.error('Error parsing saved auth:', error);
        localStorage.removeItem('adminpro-auth');
      }
      
      setAuthState(prev => ({ ...prev, isLoading: false }));
    };

    checkAuth();
  }, []);

  const login = async (userData: { email: string; password: string }) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: '1',
      name: userData.email.split('@')[0].replace(/[^a-zA-Z]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      email: userData.email,
      role: 'Admin'
    };

    setAuthState({
      isAuthenticated: true,
      user: mockUser,
      isLoading: false
    });

    // Save to localStorage for persistence
    localStorage.setItem('adminpro-auth', JSON.stringify({
      user: mockUser,
      timestamp: Date.now()
    }));
  };

  const logout = () => {
    setAuthState({
      isAuthenticated: false,
      user: null,
      isLoading: false
    });

    // Clear saved session
    localStorage.removeItem('adminpro-auth');
  };

  const updateUser = (userData: Partial<User>) => {
    if (!authState.user) return;

    const updatedUser = { ...authState.user, ...userData };
    
    setAuthState(prev => ({
      ...prev,
      user: updatedUser
    }));

    // Update localStorage
    const savedAuth = localStorage.getItem('adminpro-auth');
    if (savedAuth) {
      const parsedAuth = JSON.parse(savedAuth);
      localStorage.setItem('adminpro-auth', JSON.stringify({
        ...parsedAuth,
        user: updatedUser
      }));
    }
  };

  return {
    authState,
    login,
    logout,
    updateUser
  };
}