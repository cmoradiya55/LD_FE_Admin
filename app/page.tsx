"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoginScreen from '@/components/LoginScreen';
import ForgotPasswordScreen from '@/components/ForgotPasswordScreen';
import { LoadingSpinner } from '@/components/common';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const { authState, login } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [currentView, setCurrentView] = useState<'login' | 'forgot-password'>('login');

  useEffect(() => {
    if (!authState.isLoading && authState.isAuthenticated) {
      router.push('/dashboard');
    }
  }, [authState.isLoading, authState.isAuthenticated, router]);

  const handleLogin = async (userData: { email: string; password: string }) => {
    try {
      await login(userData);
      toast({
        title: "Welcome back!",
        description: `Logged in successfully`,
      });
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    }
  };

  const handleForgotPassword = () => {
    setCurrentView('forgot-password');
  };

  const handleBackToLogin = () => {
    setCurrentView('login');
  };

  // Show loading spinner while checking auth
  if (authState.isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Return null if authenticated (will redirect in useEffect)
  if (authState.isAuthenticated) {
    return null;
  }

  if (currentView === 'forgot-password') {
    return <ForgotPasswordScreen onBackToLogin={handleBackToLogin} />;
  }

  return (
    <LoginScreen 
      onLogin={handleLogin} 
      onForgotPassword={handleForgotPassword}
    />
  );
}