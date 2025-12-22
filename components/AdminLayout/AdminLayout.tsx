"use client";

import { useState, useEffect } from 'react';
import Header from '@/components/Header/Header';
import Sidebar from '@/components/Sidebar/Sidebar';
import { LoadingSpinner } from '@/components/common';
import { useAuth } from '@/hooks/useAuth';
import { useRouter, usePathname } from 'next/navigation';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { authState, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!authState.isLoading && !authState.isAuthenticated) {
      router.push('/login');
    }
  }, [authState.isLoading, authState.isAuthenticated, router]);

  const handleLogout = () => {
    logout();
  };

  const handleProfileClick = () => {
    router.push('/profile');
  };

  const handlePageChange = (page: string) => {
    const routeMap: { [key: string]: string } = {
      'adminDashboard': '/adminDashboard',
      'users': '/users',
      'staff': '/staff',
      'inspectionCenter': '/inspectionCenter',
      'car': '/car',
      'products': '/products',
      'profile': '/profile',
      'settings': '/settings',
      'change-password': '/settings/change-password',
      'notifications': '/notifications'
    };

    const route = routeMap[page] || '/adminDashboard';
    router.push(route);
  };

  // Map current path to sidebar page for highlighting
  const getCurrentPage = () => {
    if (pathname === '/adminDashboard') return 'adminDashboard';
    if (pathname === '/users') return 'users';
    if (pathname === '/staff' || pathname.startsWith('/staff/')) return 'staff';
    if (pathname === '/inspectionCenter') return 'inspectionCenter';
    if (pathname.startsWith('/inspectionCenter/')) return 'inspectionCenter';
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
        onBackClick: () => router.push('/adminDashboard'),
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
      
      <div className="flex-1 flex flex-col overflow-hidden h-full">
        <Header
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          onLogout={handleLogout}
          onProfileClick={handleProfileClick}
          onNotificationClick={() => router.push('/adminNotifications')}
          onMobileMenuClick={handleMobileMenuToggle}
          user={authState.user}
          {...getBackButtonProps()}
        />
        
        <main className="flex-1 overflow-y-auto p-4 sm:p-2 md:p-3 lg:p-8 min-h-0 pb-6 sm:pb-8">
          <div className="animate-in fade-in-0 slide-in-from-right-4 duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}