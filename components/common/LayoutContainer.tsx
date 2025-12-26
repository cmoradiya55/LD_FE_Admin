"use client";

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface LayoutContainerProps {
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
}

export default function LayoutContainer({ 
  children, 
  maxWidth = 'full',
  padding = 'md',
  className 
}: LayoutContainerProps) {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full'
  };

  const paddingClasses = {
    none: 'p-0',
    sm: 'p-1.5',
    md: 'p-2 sm:p-3 md:p-4',
    lg: 'p-3 sm:p-4 md:p-6'
  };

  return (
    <div className={cn(
      'mx-auto',
      maxWidthClasses[maxWidth],
      paddingClasses[padding],
      className
    )}>
      {children}
    </div>
  );
}