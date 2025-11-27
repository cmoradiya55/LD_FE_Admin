"use client";

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { LoadingSpinner } from '@/components/common';
import { useAuth } from '@/hooks/useAuth';
import { useRouter, usePathname } from 'next/navigation';

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

export default function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { authState, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!authState.isLoading && !authState.isAuthenticated) {
      router.push('/');
    }
  }, [authState.isLoading, authState.isAuthenticated, router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleProfileClick = () => {
    router.push('/profile');
  };

  const handlePageChange = (page: string) => {
    const routeMap: { [key: string]: string } = {
      'dashboard': '/dashboard',
      // 'tenants': '/users/tenants',
      // 'landlords': '/users/landlords',
      // 'staff': '/users/staff',
      'users': '/users',
      'city': '/city',
      'inspectionCenter': '/inspectionCenter',
      'car': '/car',
      'products': '/products',
      'profile': '/profile',
      'settings': '/settings',
      'change-password': '/settings/change-password',
      'notifications': '/notifications'
    };

    const route = routeMap[page] || '/dashboard';
    router.push(route);
  };

  // Map current path to sidebar page for highlighting
  const getCurrentPage = () => {
    if (pathname === '/dashboard') return 'dashboard';
    // if (pathname === '/users/tenants') return 'tenants';
    // if (pathname === '/users/landlords') return 'landlords';
    // if (pathname === '/users/staff') return 'staff';
    if (pathname === '/users') return 'users';
    if (pathname === '/city') return 'city';
    if (pathname === '/inspectionCenter') return 'inspectionCenter';
    if (pathname.startsWith('/car/')) return 'car'; // For car detail pages (e.g., /car/[slug])
    if (pathname === '/car') return 'car';
    if (pathname === '/products') return 'products';
    if (pathname.startsWith('/products/')) return 'products'; // For product detail pages
    if (pathname === '/profile') return 'profile';
    if (pathname === '/settings/change-password') return 'change-password';
    if (pathname === '/settings') return 'settings';
    if (pathname === '/notifications') return 'notifications';
    return 'dashboard';
  };

  const getBackButtonProps = () => {
    if (pathname === '/settings/change-password') {
      return {
        showBackButton: true,
        onBackClick: () => router.push('/settings'),
        backButtonLabel: 'Back to Settings'
      };
    }
    if (pathname === '/notifications') {
      return {
        showBackButton: true,
        onBackClick: () => router.push('/dashboard'),
        backButtonLabel: 'Back to Dashboard'
      };
    }
    return {
      showBackButton: false
    };
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

  // Return null if not authenticated (will redirect in useEffect)
  if (!authState.isAuthenticated) {
    return null;
  }

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        currentPage={getCurrentPage()}
        onPageChange={handlePageChange}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        onLogout={handleLogout}
        isMobileMenuOpen={isMobileMenuOpen}
        onCloseMobileMenu={handleMobileMenuClose}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          onLogout={handleLogout}
          onProfileClick={handleProfileClick}
          onNotificationClick={() => router.push('/notifications')}
          onMobileMenuClick={handleMobileMenuToggle}
          user={authState.user}
          {...getBackButtonProps()}
        />
        
        <main className="flex-1 overflow-y-auto p-1.5 sm:p-2 md:p-3 lg:p-8">
          <div className="animate-in fade-in-0 slide-in-from-right-4 duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}