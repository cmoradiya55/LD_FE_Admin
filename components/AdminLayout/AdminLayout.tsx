"use client";

import { useAuth } from "@/hooks/useAuth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { LoadingSpinner } from "../common";
import { Button } from '@/components/Button/Button';
import Sidebar from '@/components/Sidebar/Sidebar';
import BottomBar from '@/components/BottomBar/BottomBar';
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

  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    checkScreenSize();

    window.addEventListener('resize', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  useEffect(() => {
    if (!authState.isLoading && !authState.isAuthenticated) {
      toast.error('Session expired. Please log in again.');
      router.push('/login');
      return;
    }

    if (!authState.isLoading && authState.isAuthenticated && authState.user?.roleId) {
      const roleId = authState.user.roleId;
      
      if (pathname.startsWith('/admin/') && roleId !== 1) {
        toast.error('You are not allowed to access the admin area.');
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
      'inspectorList': '/manager/inspectorList',
      'carList': '/manager/carList',
      'profile': '/manager/profile',
      'notifications': '/manager/notifications',
    };

    const inspectorRouteMap: { [key: string]: string } = {
      'inspectorDashboard': '/inspector/inspectorDashboard',
      'carList': '/inspector/carList',
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

  const getCurrentPage = () => {
    const roleId = authState.user?.roleId;
    
    let pagePath = pathname;
    
    if (pathname.startsWith('/admin/')) {
      pagePath = pathname.replace('/admin/', '');
    } else if (pathname.startsWith('/manager/')) {
      pagePath = pathname.replace('/manager/', '');
    } else if (pathname.startsWith('/inspector/')) {
      pagePath = pathname.replace('/inspector/', '');
    } else {
      pagePath = pathname.replace(/^\//, '');
    }
    
    // Handle dashboard routes
    if (pagePath === 'adminDashboard') return 'adminDashboard';
    if (pagePath === 'managerDashboard') return 'managerDashboard';
    if (pagePath === 'inspectorDashboard') return 'inspectorDashboard';
    
    const baseRoute = pagePath.split('/')[0];
    
    // Admin routes
    const adminRouteMap: { [key: string]: string } = {
      'car': 'car',
      'inspectionCenter': 'inspectionCenter',
      'staff': 'staff',
      'users': 'users',
      'products': 'products',
      'profile': 'profile',
      'notifications': 'notifications',
    };
    
    // Manager routes
    const managerRouteMap: { [key: string]: string } = {
      'inspectorList': 'inspectorList',
      'carList': 'carList',
      'profile': 'profile',
      'notifications': 'notifications',
    };
    
    // Inspector routes
    const inspectorRouteMap: { [key: string]: string } = {
      'carList': 'carList',
      'profile': 'profile',
      'notifications': 'notifications',
    };
    
    // Return based on role
    if (roleId === 1) {
      // Admin
      if (adminRouteMap[baseRoute]) {
        return adminRouteMap[baseRoute];
      }
      return 'adminDashboard';
    } else if (roleId === 2) {
      // Manager
      if (managerRouteMap[baseRoute]) {
        return managerRouteMap[baseRoute];
      }
      return 'managerDashboard';
    } else if (roleId === 3) {
      // Inspector
      if (inspectorRouteMap[baseRoute]) {
        return inspectorRouteMap[baseRoute];
      }
      return 'inspectorDashboard';
    }
    
    // Default fallback
    if (adminRouteMap[baseRoute]) {
      return adminRouteMap[baseRoute];
    }
    
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

  if (!authState.isAuthenticated || !authState.user?.roleId) {
    return null;
  }

  const roleId = authState.user?.roleId;
  const isMobileOnlyRole = roleId === 2 || roleId === 3;
  
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
      {/* Sidebar - Only visible on desktop (lg and above) */}
      <div className="hidden lg:block">
        <Sidebar
          currentPage={getCurrentPage()}
          onPageChange={handlePageChange}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          onLogout={handleLogout}
          isMobileMenuOpen={false}
          onCloseMobileMenu={handleMobileMenuClose}
          roleId={authState.user?.roleId}
        />
      </div>
      
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
        
        <main className="flex-1 overflow-y-auto p-4 sm:p-2 md:p-3 lg:p-8 min-h-0 pb-20 lg:pb-6 sm:pb-8">
          <div className="animate-in fade-in-0 slide-in-from-right-4 duration-500">
            {children}
          </div>
        </main>
      </div>
      
      {/* BottomBar - Only visible on mobile (below lg) */}
      <BottomBar
        currentPage={getCurrentPage()}
        onPageChange={handlePageChange}
        roleId={authState.user?.roleId}
      />
    </div>
  );
}