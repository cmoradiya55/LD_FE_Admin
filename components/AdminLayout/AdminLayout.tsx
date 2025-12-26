"use client";

import { useAuth } from "@/hooks/useAuth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { LoadingSpinner } from "../common";
import { Button } from '@/components/Button/Button';
import Sidebar from '@/components/Sidebar/Sidebar';
import Header from '@/components/Header/Header';


interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const { authState, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  // Check screen size for mobile-only roles (Manager and Inspector)
  useEffect(() => {
    const checkScreenSize = () => {
      // Large screen breakpoint: 1024px (lg in Tailwind)
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    // Check on mount
    checkScreenSize();

    // Listen for resize events
    window.addEventListener('resize', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  // Check authentication and role-based route access
  useEffect(() => {
    if (!authState.isLoading && !authState.isAuthenticated) {
      toast.error('Session expired. Please log in again.');
      router.push('/login');
      return;
    }

    // Wait for roleId to be available before checking route access
    if (!authState.isLoading && authState.isAuthenticated && authState.user?.roleId) {
      const roleId = authState.user.roleId;
      
      // Check if user is trying to access a route for a different role
      // roleId 1 = Admin, roleId 2 = Manager, roleId 3 = Inspector
      if (pathname.startsWith('/admin/') && roleId !== 1) {
        toast.error('You are not allowed to access the admin area.');
        // Redirect to correct dashboard based on role
        if (roleId === 2) {
          router.push('/manager/managerDashboard');
        } else if (roleId === 3) {
          router.push('/inspector/inspectorDashboard');
        }
      } else if (pathname.startsWith('/manager/') && roleId !== 2) {
        toast.error('You are not allowed to access the manager area.');
        if (roleId === 1) {
          router.push('/admin/adminDashboard');
        } else if (roleId === 3) {
          router.push('/inspector/inspectorDashboard');
        }
      } else if (pathname.startsWith('/inspector/') && roleId !== 3) {
        toast.error('You are not allowed to access the inspector area.');
        if (roleId === 1) {
          router.push('/admin/adminDashboard');
        } else if (roleId === 2) {
          router.push('/manager/managerDashboard');
        }
      }
    }
  }, [authState.isLoading, authState.isAuthenticated, authState.user?.roleId, pathname, router]);

  const handleProfileClick = () => {
    router.push('/profile');
  };

  const handlePageChange = (page: string) => {
    const roleId = authState.user?.roleId;
    
    // Role-specific route maps
    const adminRouteMap: { [key: string]: string } = {
      'adminDashboard': '/admin/adminDashboard',
      'users': '/admin/users',
      'staff': '/admin/staff',
      'inspectionCenter': '/admin/inspectionCenter',
      'car': '/admin/car',
      'products': '/admin/products',
      'profile': '/admin/profile',
      'notifications': '/admin/notifications',
    };

    const managerRouteMap: { [key: string]: string } = {
      'managerDashboard': '/manager/managerDashboard',
      'staff': '/manager/staff',
      'inspectionCenter': '/manager/inspectionCenter',
      'car': '/manager/car',
      'profile': '/manager/profile',
      'notifications': '/manager/notifications',
    };

    const inspectorRouteMap: { [key: string]: string } = {
      'inspectorDashboard': '/inspector/inspectorDashboard',
      'car': '/inspector/car',
      'profile': '/inspector/profile',
      'notifications': '/inspector/notifications',
    };

    let routeMap: { [key: string]: string };
    let defaultRoute: string;

    switch (roleId) {
      case 1: // Admin
        routeMap = adminRouteMap;
        defaultRoute = '/admin/adminDashboard';
        break;
      case 2: // Manager
        routeMap = managerRouteMap;
        defaultRoute = '/manager/managerDashboard';
        break;
      case 3: // Inspector
        routeMap = inspectorRouteMap;
        defaultRoute = '/inspector/inspectorDashboard';
        break;
      default:
        routeMap = adminRouteMap;
        defaultRoute = '/admin/adminDashboard';
    }

    const route = routeMap[page] || defaultRoute;
    router.push(route);
  };

  // Map current path to sidebar page for highlighting
  const getCurrentPage = () => {
    const roleId = authState.user?.roleId;
    
    // Role-specific dashboard routes
    if (pathname === '/admin/adminDashboard' || pathname === '/adminDashboard') return 'adminDashboard';
    if (pathname === '/manager/managerDashboard' || pathname === '/managerDashboard') return 'managerDashboard';
    if (pathname === '/inspector/inspectorDashboard' || pathname === '/inspectorDashboard') return 'inspectorDashboard';
    
    // Common routes
    if (pathname === '/users') return 'users';
    if (pathname === '/staff' || pathname.startsWith('/staff/')) return 'staff';
    if (pathname === '/inspectionCenter') return 'inspectionCenter';
    if (pathname.startsWith('/inspectionCenter/')) return 'inspectionCenter';
    if (pathname.startsWith('/car/')) return 'car'; // For car detail pages (e.g., /car/[slug])
    if (pathname === '/car') return 'car';
    if (pathname === '/products') return 'products';
    if (pathname.startsWith('/products/')) return 'products'; // For product detail pages
    if (pathname === '/profile') return 'profile';
    if (pathname === '/notifications') return 'notifications';
    
    // Default based on role
    if (roleId === 1) return 'adminDashboard';
    if (roleId === 2) return 'managerDashboard';
    if (roleId === 3) return 'inspectorDashboard';
    
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
    if (pathname === '/notifications' || pathname === '/adminNotifications' || pathname === '/inspectorNotifications' || pathname === '/managerNotifications') {
      const roleId = authState.user?.roleId;
      let dashboardRoute = '/admin/adminDashboard';
      if (roleId === 1) dashboardRoute = '/admin/adminDashboard';
      if (roleId === 2) dashboardRoute = '/manager/managerDashboard';
      if (roleId === 3) dashboardRoute = '/inspector/inspectorDashboard';
      
      return {
        showBackButton: true,
        onBackClick: () => router.push(dashboardRoute),
        backButtonLabel: 'Back to Dashboard'
      };
    }
    return {
      showBackButton: false
    };
  };

  // Show loading spinner while checking auth or waiting for roleId
  if (authState.isLoading || (authState.isAuthenticated && !authState.user?.roleId)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  // Return null if not authenticated (will redirect in useEffect)
  if (!authState.isAuthenticated || !authState.user?.roleId) {
    return null;
  }

  // Check if user is Manager or Inspector trying to access on large screen
  const roleId = authState.user?.roleId;
  const isMobileOnlyRole = roleId === 2 || roleId === 3; // Manager or Inspector
  
  if (isMobileOnlyRole && isLargeScreen) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Mobile Only Access
            </h1>
            <p className="text-gray-600 mb-4">
              {roleId === 2 
                ? 'Manager dashboard is only available on mobile devices.' 
                : 'Inspector dashboard is only available on mobile devices.'}
            </p>
            <p className="text-sm text-gray-500">
              Please access this application using a mobile devices.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full"
            >
              Logout
            </Button>
            <p className="text-xs text-gray-400 mt-4">
              Current screen width: {typeof window !== 'undefined' ? window.innerWidth : 0}px
            </p>
          </div>
        </div>
      </div>
    );
  }

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
        roleId={authState.user?.roleId}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden h-full">
        <Header
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          onLogout={handleLogout}
          onProfileClick={handleProfileClick}
          onNotificationClick={() => {
            const roleId = authState.user?.roleId;
            if (roleId === 1) {
              router.push('/adminNotifications');
            } else if (roleId === 2) {
              router.push('/managerNotifications');
            } else if (roleId === 3) {
              router.push('/inspectorNotifications');
            } else {
              router.push('/adminNotifications');
            }
          }}
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