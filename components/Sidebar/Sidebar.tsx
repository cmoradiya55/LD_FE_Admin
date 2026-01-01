"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { Button } from '@/components/Button/Button';
import { LayoutDashboard, Users, LogOut, ChevronLeft, ChevronRight, User, BadgeCheck, CarFront } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onLogout: () => void;
  isMobileMenuOpen?: boolean;
  onCloseMobileMenu?: () => void;
  roleId?: number; // 1 = Admin, 2 = Manager, 3 = Inspector
}

// Role-based menu configurations
const adminMenuItems = [
  { id: 'adminDashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'users', label: 'Users', icon: User },
  { id: 'staff', label: 'Staff', icon: Users },
  { id: 'inspectionCenter', label: 'Inspection Center', icon: BadgeCheck },
  { id: 'car', label: 'Car', icon: CarFront },
  { id: 'profile', label: 'Profile', icon: User },
];

const managerMenuItems = [
  { id: 'managerDashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'inspectorList', label: 'Inspector List', icon: BadgeCheck },
  { id: 'carList', label: 'Car List', icon: CarFront },
  { id: 'profile', label: 'Profile', icon: User },
];

const inspectorMenuItems = [
  { id: 'inspectorDashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'carList', label: 'Car List', icon: CarFront },
  { id: 'profile', label: 'Profile', icon: User },
];

// Get menu items based on role
const getMenuItems = (roleId?: number) => {
  switch (roleId) {
    case 1: // Admin
      return adminMenuItems;
    case 2: // Manager
      return managerMenuItems;
    case 3: // Inspector
      return inspectorMenuItems;
    default:
      return adminMenuItems; // Default to admin
  }
};

export default function Sidebar({
  currentPage,
  onPageChange,
  collapsed,
  onToggleCollapse,
  onLogout,
  isMobileMenuOpen = false,
  onCloseMobileMenu,
  roleId
}: SidebarProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [activeIndicatorStyle, setActiveIndicatorStyle] = useState<{ top: number; height: number; opacity: number }>({ top: 0, height: 44, opacity: 0 });
  const navRef = useRef<HTMLElement>(null);
  const rafRef = useRef<number | null>(null);

  const menuItems = useMemo(() => getMenuItems(roleId), [roleId]);

  const updateActiveIndicator = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      if (!navRef.current || collapsed) {
        setActiveIndicatorStyle(prev => ({ ...prev, opacity: 0 }));
        return;
      }

      const activeEl = navRef.current.querySelector(`[data-menu-id="${currentPage}"]`) as HTMLElement | null;

      if (activeEl) {
        const navRect = navRef.current.getBoundingClientRect();
        const elRect = activeEl.getBoundingClientRect();
        setActiveIndicatorStyle({
          top: elRect.top - navRect.top,
          height: elRect.height,
          opacity: 1,
        });
      } else {
        setActiveIndicatorStyle(prev => ({ ...prev, opacity: 0 }));
      }
    });
  }, [currentPage, collapsed]);

  useEffect(() => {
    updateActiveIndicator();
    const timer = setTimeout(updateActiveIndicator, 100);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      clearTimeout(timer);
    };
  }, [updateActiveIndicator]);

  useEffect(() => {
    if (collapsed) {
      setActiveIndicatorStyle(prev => ({ ...prev, opacity: 0 }));
    }
  }, [collapsed]);

  const handlePageChange = useCallback((page: string) => {
    onPageChange(page);
    onCloseMobileMenu?.();
  }, [onPageChange, onCloseMobileMenu]);

  return (
    <>
      {isMobileMenuOpen &&
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onCloseMobileMenu} />
      }
      <div className={cn(
        "bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out shadow-lg h-screen sticky top-0",
        // Mobile/Tablet: Drawer behavior
        "lg:relative fixed lg:translate-x-0 z-50",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        // Desktop: Collapsed state
        collapsed ? "lg:w-[85px]" : "w-64 lg:w-60"
      )}>
        <div className="border-b border-gray-200 h-16 sm:h-20 px-3 sm:px-4 flex items-center">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Image
                src="/logo.webp"
                alt="Logo"
                width={45}
                height={45}
                className="w-8 h-8 sm:w-10 sm:h-10 lg:w-16 lg:h-16 object-contain flex-shrink-0"
                priority
                onClick={() => handlePageChange('adminDashboard')}
              />
              {!collapsed &&
                <div className="animate-in fade-in-0 slide-in-from-left-2 duration-200">
                  <h1 className="text-sm sm:text-base lg:text-lg font-bold text-gray-900">AdminPro</h1>
                </div>
              }
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleCollapse}
              className="hidden lg:flex p-1.5 mr-2 transition-colors"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              disabled={collapsed}
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </Button>
            {onCloseMobileMenu &&
              <Button
                variant="ghost"
                size="sm"
                onClick={onCloseMobileMenu}
                className="lg:hidden p-1.5 mr-2 transition-colors"
                aria-label="Close menu"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>}
          </div>
        </div>

        {/* Navigation */}
        <nav
          ref={navRef}
          className={cn(
            "flex-1 relative",
            collapsed ? "lg:p-3 p-2 space-y-1" : "p-2 sm:p-3 lg:p-4 space-y-1 sm:space-y-2 overflow-y-auto scrollbar-hide"
          )}
        >
          {!collapsed &&
            <div
              className="absolute bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg transition-all duration-300 ease-out pointer-events-none z-0 hidden lg:block"
              style={{ left: '8px', width: 'calc(100% - 16px)', top: `${activeIndicatorStyle.top}px`, height: `${activeIndicatorStyle.height}px`, opacity: activeIndicatorStyle.opacity, transform: 'translateZ(0)' }} />}

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            const isHovered = hoveredItem === item.id;

            return (
              <button
                key={item.id}
                data-menu-id={item.id}
                className={cn(
                  "w-full transition-all duration-200 group relative z-10 !bg-transparent !hover:bg-transparent flex items-center text-xs sm:text-sm",
                  collapsed ? "lg:h-12 h-10 px-1.5 justify-center" : "h-9 sm:h-10 lg:h-11 px-2 sm:px-3 lg:px-4 justify-start",
                  !collapsed && isActive && "lg:text-white text-blue-600 lg:bg-transparent",
                  collapsed && isActive && "lg:bg-blue-600 lg:text-white lg:rounded-lg bg-blue-50 text-blue-600 rounded-md",
                  !collapsed && !isActive && "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                )}
                onClick={() => handlePageChange(item.id)}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <Icon className={cn(
                  "transition-all duration-200",
                  collapsed ? "w-4 h-4 sm:w-5 sm:h-5 mx-auto" : "w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3",
                  collapsed ? (isActive ? "text-blue-600" : "text-gray-600") : (isActive ? "lg:text-white text-blue-600" : "text-gray-600"),
                  isHovered && !collapsed && !isActive && "scale-110"
                )} />
                {!collapsed && <span className="font-medium flex-1 text-left self-center">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-2 sm:p-3 lg:p-4 border-t border-gray-200">
          <Button
            variant="ghost"
            className={cn(
              "w-full text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200 flex items-center text-xs sm:text-sm",
              collapsed ? "lg:h-10 h-9 px-1.5 justify-center" : "h-9 sm:h-10 lg:h-11 px-2 sm:px-3 lg:px-4 justify-start"
            )}
            onClick={() => { onLogout(); onCloseMobileMenu?.(); }}
            onMouseEnter={() => setHoveredItem('logout')}
            onMouseLeave={() => setHoveredItem(null)}
            aria-label="Logout"
          >
            <LogOut className={cn(
              "transition-all duration-200",
              collapsed ? "w-4 h-4 sm:w-5 sm:h-5 mx-auto" : "w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3",
              hoveredItem === 'logout' && "scale-110"
            )} />
            {!collapsed && <span className="font-medium">Logout</span>}
          </Button>
        </div>
      </div>
    </>
  );
}