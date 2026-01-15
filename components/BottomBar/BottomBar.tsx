"use client";

import { useMemo } from 'react';
import { 
  LayoutDashboard, 
  Users,
  User,
  BadgeCheck,
  CarFront
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface BottomBarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  roleId?: number; // 1 = Admin, 2 = Manager, 3 = Inspector, 4 = Staff
}

// Role-based menu configurations (same as Sidebar)
const adminMenuItems = [
  { id: 'adminDashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'users', label: 'Users', icon: User },
  { id: 'staff', label: 'Staff', icon: Users },
  { id: 'inspectionCenter', label: 'Center', icon: BadgeCheck },
  { id: 'car', label: 'Car', icon: CarFront },
  { id: 'profile', label: 'Profile', icon: User },
];

const managerMenuItems = [
  { id: 'managerDashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'staff', label: 'Staff', icon: Users },
  { id: 'inspectionCenter', label: 'Center', icon: BadgeCheck },
  { id: 'car', label: 'Car', icon: CarFront },
  { id: 'profile', label: 'Profile', icon: User },
];

const inspectorMenuItems = [
  { id: 'inspectorDashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'car', label: 'Car', icon: CarFront },
  { id: 'profile', label: 'Profile', icon: User },
];

const staffMenuItems = [
  { id: 'staffDashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'car', label: 'Car', icon: CarFront },
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
    case 4: // Staff
      return staffMenuItems;
    default:
      return adminMenuItems; // Default to admin
  }
};

export default function BottomBar({ 
  currentPage, 
  onPageChange,
  roleId
}: BottomBarProps) {
  // Get menu items based on role
  const menuItems = useMemo(() => getMenuItems(roleId), [roleId]);

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <nav className="flex items-center justify-around h-16 px-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 relative",
                "active:scale-95"
              )}
              aria-label={item.label}
            >
              <div className={cn(
                "flex flex-col items-center justify-center space-y-1",
                isActive && "transform scale-105"
              )}>
                <Icon className={cn(
                  "w-5 h-5 transition-colors duration-200",
                  isActive ? "text-blue-600" : "text-gray-500"
                )} />
                <span className={cn(
                  "text-xs font-medium transition-colors duration-200",
                  isActive ? "text-blue-600" : "text-gray-500"
                )}>
                  {item.label}
                </span>
              </div>
              {/* Active indicator dot */}
              {isActive && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

