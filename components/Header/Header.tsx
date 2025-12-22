"use client";

import { useState } from 'react';
import Image from 'next/image';
import { useFlags } from '@/components/providers/FlagsProvider';
import { Button } from '@/components/Button/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import {
  Menu,
  Bell,
  Search,
  Settings,
  User,
  LogOut,
  Sun,
  ArrowLeft
} from 'lucide-react';

interface HeaderProps {
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  onLogout: () => void;
  onProfileClick: () => void;
  onNotificationClick?: () => void;
  showBackButton?: boolean;
  onBackClick?: () => void;
  backButtonLabel?: string;
  onMobileMenuClick?: () => void;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  } | null;
}

export default function Header({
  sidebarCollapsed,
  onToggleSidebar,
  onLogout,
  onProfileClick,
  onNotificationClick,
  showBackButton = false,
  onBackClick,
  backButtonLabel = "Back",
  onMobileMenuClick,
  user
}: HeaderProps) {
  const [notifications] = useState(3);
  const { enableAdvancedAI } = useFlags();

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm h-16 sm:h-20 px-3 sm:px-5 py-4 sm:py-8 flex items-center">
      <div className="flex w-full items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {showBackButton && onBackClick ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBackClick}
              className="flex items-center gap-2 p-2 hover:bg-gray-100 text-gray-700 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">{backButtonLabel}</span>
            </Button>
          ) : (
            <>

              {/* Menu Button - visible on mobile/tablet only */}
              <Button
                variant="ghost"
                size="sm"
                onClick={onMobileMenuClick || onToggleSidebar}
                className="md:hidden p-2 hover:bg-gray-100"
              >
                <Menu className="w-5 h-5" />
              </Button>

              {/* Logo - visible on mobile/tablet */}
              <div className="flex items-center space-x-1.5 sm:space-x-2 lg:hidden">
                <Image
                  src="/logo.webp"
                  alt="Logo"
                  width={80}
                  height={80}
                  className="w-12 h-12 sm:w-12 sm:h-12 md:w-12 md:h-12 object-contain"
                  priority
                />
                {/* <h1 className="text-sm sm:text-base font-bold text-gray-900">AdminPro</h1> */}
              </div>

            </>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-3">
          {/* Notifications */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onNotificationClick}
            className="relative p-2 hover:bg-gray-100 transition-colors"
          >
            <Bell className="w-5 h-5 text-gray-600" />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                {notifications}
              </span>
            )}
          </Button>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-gray-100 transition-all duration-200 hover:scale-105">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg" alt={user?.name || 'Profile'} />
                  <AvatarFallback className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                    {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'JD'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 mt-2 animate-in fade-in-0 slide-in-from-top-2 duration-200"
              align="end"
              forceMount
            >
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.name || 'John Doe'}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email || 'john.doe@company.com'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={onProfileClick}
              >
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer hover:bg-gray-50 transition-colors">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer hover:bg-gray-50 transition-colors">
                <Sun className="mr-2 h-4 w-4" />
                <span>Theme</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50 transition-colors"
                onClick={onLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}