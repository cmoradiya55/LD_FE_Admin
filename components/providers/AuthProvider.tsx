'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { sendOtp, verifyOtp } from '@/lib/auth';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  roleId?: number;
  mobileNo?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
}

interface AuthContextType {
  authState: AuthState;
  sendOTP: (contact: string) => Promise<{ success: boolean; error?: string }>;
  login: (contact: string, otp: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true
  });

  // Check for existing session on mount and listen for storage changes
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
            localStorage.removeItem('adminpro-token');
          }
        }
      } catch (error) {
        console.error('Error parsing saved auth:', error);
        localStorage.removeItem('adminpro-auth');
        localStorage.removeItem('adminpro-token');
      }

      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false
      });
    };

    checkAuth();

    // Listen for storage changes (e.g., when logout clears localStorage from another hook)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'adminpro-auth' || e.key === null) {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Also listen for custom events (for same-window localStorage changes)
    const handleCustomStorageChange = () => {
      checkAuth();
    };
    window.addEventListener('auth:logout', handleCustomStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth:logout', handleCustomStorageChange);
    };
  }, []);

  const sendOTP = async (contact: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const countryCode = 91;
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

      console.log('Send OTP Response:', response);

      if (response?.code && response?.code >= 400) {
        const errorMessages = response?.errors?.map((err: any) => err.message).join(', ') ||
          response?.message ||
          response?.error ||
          'Failed to send OTP';
        return {
          success: false,
          error: errorMessages
        };
      }

      if (response?.success || response?.data || (response?.code && response?.code < 400) || !response?.code) {
        return { success: true };
      }

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
      const countryCode = 91;
      const mobileNo = Number(contact);

      if (!mobileNo) {
        return { success: false, error: 'Invalid mobile number' };
      }

      const payload = {
        countryCode,
        mobileNo,
        otp
      };

      console.log('Login Request Payload:', payload);
      const response = await verifyOtp(payload);
      console.log('Login API Response:', response);

      // Check if response indicates an error (code >= 400)
      if (response?.code && response?.code >= 400) {
        const errorMessage = response?.message || response?.error || 'Login failed';
        return { success: false, error: errorMessage };
      }

      // Accept success codes: 200, 201, or any 2xx status (200-299)
      // API returns 201 (Created) which is a valid success code
      const isSuccess = !response?.code || (response?.code >= 201);
      alert(`isSuccess: ${response} and response?.code: ${response?.code} and ${response?.code >= 201}`);
      if (!isSuccess) {
        const errorMessage = response?.message || response?.error || 'Login failed';
        return { success: false, error: errorMessage };
      }

      const token = response?.data?.accessToken;
      const user = response?.data;
      alert(response);
      if (!token || !user) {
        const errorMessage = response?.message || 'Invalid response from server';
        return { success: false, error: errorMessage };
      }

      setAuthState({
        isAuthenticated: true,
        user,
        isLoading: false
      });

      localStorage.setItem(
        'adminpro-auth',
        JSON.stringify({
          user,
          token,
          timestamp: Date.now()
        })
      );

      if (token) {
        localStorage.setItem('adminpro-token', token);
      }

      const roleId = user.roleId;
      switch (roleId) {
        case 1:
          router.push('/admin/adminDashboard');
          break;
        case 2:
          router.push('/manager/managerDashboard');
          break;
        case 3:
          router.push('/inspector/inspectorDashboard');
          break;
        default:
          return { success: false, error: 'Invalid role' };
      }

      return { success: true };
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Invalid OTP';

      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    localStorage.removeItem('adminpro-auth');
    localStorage.removeItem('adminpro-token');

    setAuthState({
      isAuthenticated: false,
      user: null,
      isLoading: false
    });

    router.push('/login');
  };

  const updateUser = (userData: Partial<User>) => {
    if (!authState.user) return;

    const updatedUser = { ...authState.user, ...userData };

    setAuthState(prev => ({
      ...prev,
      user: updatedUser
    }));

    const savedAuth = localStorage.getItem('adminpro-auth');
    if (savedAuth) {
      const parsedAuth = JSON.parse(savedAuth);
      localStorage.setItem('adminpro-auth', JSON.stringify({
        ...parsedAuth,
        user: updatedUser
      }));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        authState,
        sendOTP,
        login,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
