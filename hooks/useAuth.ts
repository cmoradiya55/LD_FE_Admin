"use client";

import { useState, useEffect } from 'react';
import { sendOtp, verifyOtp } from '@/lib/auth';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  roleId?: number;
  phone?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
}

interface AuthHook {
  authState: AuthState;
  sendOTP: (contact: string) => Promise<{ success: boolean; error?: string }>;
  login: (contact: string, otp: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

export function useAuth(): AuthHook {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true
  });
  const router = useRouter();

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

  const sendOTP = async (contact: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // API expects countryCode (number) and mobileNo (number)
      const countryCode = 91; // India country code
      const mobileNo = parseInt(contact, 10);
      
      if (isNaN(mobileNo) || mobileNo <= 0) {
        return {
          success: false,
          error: 'Invalid mobile number'
        };
      }
      
      const response = await sendOtp({ 
        countryCode: countryCode,
        mobileNo: mobileNo
      });
      
      // Check if response indicates an error (has code field with error status or has errors array)
      if (response?.code && response?.code >= 400) {
        // Handle validation errors from API
        const errorMessages = response?.errors?.map((err: any) => err.message).join(', ') || 
                             response?.message || 
                             response?.error || 
                             'Failed to send OTP';
        return { 
          success: false, 
          error: errorMessages
        };
      }
      
      // Check for success indicators
      if (response?.success || response?.data || (response?.code && response?.code < 400) || !response?.code) {
        return { success: true };
      }
      
      // If we get here, response structure is unexpected
      return { 
        success: false, 
        error: response?.message || response?.error || 'Failed to send OTP'
      };
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 
                          error?.response?.data?.error || 
                          error?.message || 
                          'Failed to send OTP';
      return { 
        success: false, 
        error: errorMessage
      };
    }
  };

  const login = async (contact: string, otp: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // API expects countryCode (number) and mobileNo (number)
      const countryCode = 91; // India country code
      const mobileNo = parseInt(contact, 10);
      
      if (isNaN(mobileNo) || mobileNo <= 0) {
        return {
          success: false,
          error: 'Invalid mobile number'
        };
      }
      
      const response = await verifyOtp({ 
        countryCode: countryCode,
        mobileNo: mobileNo,
        otp: otp
      });
      
      if (response?.success || response?.data) {
        const userData = response?.data?.user || response?.user || {
          id: response?.data?.id || '1',
          name: response?.data?.name || contact,
          email: response?.data?.email || `${contact}@example.com`,
          role: response?.data?.role || 'Admin',
          phone: contact
        };

        const user: User = {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          role: userData.role,
          phone: userData.phone || contact
        };

        setAuthState({
          isAuthenticated: true,
          user: user,
          isLoading: false
        });
        console.log('Login Response:', response);
        
        // Save to localStorage for persistence
        localStorage.setItem('adminpro-auth', JSON.stringify({
          user: user,
          token: response?.data?.accessToken,
          timestamp: Date.now()
        }));

        return { success: true };
      } else {
        // Handle validation errors from API
        const errorMessages = response?.errors?.map((err: any) => err.message).join(', ') || 
                             response?.message || 
                             response?.error || 
                             'Invalid OTP';
        return { 
          success: false, 
          error: errorMessages
        };
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 
                          error?.response?.data?.error || 
                          error?.message || 
                          'Invalid OTP';
      return { 
        success: false, 
        error: errorMessage
      };
    }
  };

  const logout = () => {
    // Clear saved session FIRST before any state changes or redirects
    localStorage.removeItem('adminpro-auth');
    localStorage.removeItem('adminpro-token');
    
    // Dispatch custom event to notify AuthProvider of logout
    window.dispatchEvent(new CustomEvent('auth:logout'));
    
    // Update state
    setAuthState({
      isAuthenticated: false,
      user: null,
      isLoading: false
    });
    
    // Redirect to login
    router.push('/login');
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
    sendOTP,
    login,
    logout,
    updateUser
  };
}