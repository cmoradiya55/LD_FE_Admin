"use client";

import { cn } from '@/lib/utils';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface UserAvatarProps {
  user: User;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showName?: boolean;
  showEmail?: boolean;
}

export default function UserAvatar({ 
  user, 
  size = 'md', 
  className,
  showName = false,
  showEmail = false 
}: UserAvatarProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (showName || showEmail) {
    return (
      <div className={cn("flex items-center space-x-3", className)}>
        <div 
          className={cn(
            "rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white flex items-center justify-center font-medium",
            sizeClasses[size],
            textSizeClasses[size]
          )}
        >
          {getInitials(user.name)}
        </div>
        <div>
          {showName && (
            <p className="font-medium text-gray-900">{user.name}</p>
          )}
          {showEmail && (
            <p className="text-sm text-gray-600">{user.email}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div 
      className={cn(
        "rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white flex items-center justify-center font-medium",
        sizeClasses[size],
        textSizeClasses[size],
        className
      )}
      title={user.name}
    >
      {getInitials(user.name)}
    </div>
  );
}