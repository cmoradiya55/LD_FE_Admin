"use client";

import { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DataTableWrapperProps {
  title: string;
  description?: string;
  searchComponent?: ReactNode;
  filterComponent?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  isLoading?: boolean;
  error?: string;
  onRetry?: () => void;
}

export default function DataTableWrapper({
  title,
  description,
  searchComponent,
  filterComponent,
  actions,
  children,
  className,
  isLoading = false,
  error,
  onRetry
}: DataTableWrapperProps) {
  if (error) {
    return (
      <Card className={cn("shadow-md border-0", className)}>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Data</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            {onRetry && (
              <Button onClick={onRetry} variant="outline">
                Try Again
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("shadow-md border-0", className)}>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            {description && (
              <CardDescription>{description}</CardDescription>
            )}
          </div>
          
          {(searchComponent || filterComponent || actions) && (
            <div className="flex items-center space-x-2 flex-wrap">
              {searchComponent}
              {filterComponent}
              {actions}
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-600">Loading...</span>
            </div>
          </div>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
}