"use client";

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  className?: string;
}

export default function PageHeader({
  title,
  description,
  actions,
  breadcrumbs,
  className
}: PageHeaderProps) {
  return (
    <div className={cn("space-y-2 sm:space-y-2.5", className)}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center space-x-1.5 text-xs text-gray-600">
            {breadcrumbs.map((breadcrumb, index) => (
              <li key={index} className="flex items-center">
                {index > 0 && <span className="mx-1.5">/</span>}
                {breadcrumb.href ? (
                  <a
                    href={breadcrumb.href}
                    className="hover:text-gray-900 transition-colors text-xs"
                  >
                    {breadcrumb.label}
                  </a>
                ) : (
                  <span className="text-gray-900 font-medium text-xs">
                    {breadcrumb.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
        <div>
          <h1 className="text-lg sm:text-xl md:text-xl lg:text-2xl font-bold text-gray-900">
            {title}
          </h1>
          {description && (
            <p className="text-xs sm:text-sm text-gray-600 mt-0.5">{description}</p>
          )}
        </div>
        
        {actions && (
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}