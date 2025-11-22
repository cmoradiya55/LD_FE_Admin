"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

export interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  trend?: {
    value: string;
    type: 'up' | 'down' | 'neutral';
    label?: string;
  };
  className?: string;
  onClick?: () => void;
}

export default function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
  onClick
}: StatCardProps) {
  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-600'
  };

  const trendIcons = {
    up: '↗',
    down: '↘',
    neutral: '→'
  };

  return (
    <Card 
      className={cn(
        "shadow-md border-0 transition-all duration-200",
        onClick && "cursor-pointer hover:shadow-lg hover:-translate-y-1",
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        {Icon && (
          <div className="p-2 rounded-lg bg-gray-50">
            <Icon className="w-4 h-4 text-gray-600" />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900 mb-1">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        
        {(trend || description) && (
          <div className="flex items-center justify-between">
            {trend && (
              <div className={cn("flex items-center text-sm font-medium", trendColors[trend.type])}>
                <span className="mr-1">{trendIcons[trend.type]}</span>
                <span>{trend.value}</span>
                {trend.label && (
                  <span className="text-gray-600 ml-1">{trend.label}</span>
                )}
              </div>
            )}
            
            {description && !trend && (
              <p className="text-sm text-gray-600">{description}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}