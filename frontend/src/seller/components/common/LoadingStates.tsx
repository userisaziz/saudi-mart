import React from 'react';
import { ArrowPathIcon, CubeIcon, ShoppingBagIcon, UserGroupIcon } from '@heroicons/react/24/outline';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  return (
    <ArrowPathIcon 
      className={`${sizeClasses[size]} animate-spin text-blue-600 ${className}`} 
    />
  );
};

interface SkeletonProps {
  className?: string;
  lines?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  className = 'h-4 bg-gray-200 rounded', 
  lines = 1 
}) => {
  if (lines === 1) {
    return <div className={`${className} animate-pulse`}></div>;
  }

  return (
    <div className="space-y-3">
      {Array.from({ length: lines }, (_, i) => (
        <div key={i} className={`${className} animate-pulse`}></div>
      ))}
    </div>
  );
};

export const TableSkeleton: React.FC<{ rows?: number; cols?: number }> = ({ 
  rows = 5, 
  cols = 4 
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
        <div className="flex space-x-4">
          {Array.from({ length: cols }, (_, i) => (
            <div key={i} className="flex-1">
              <Skeleton className="h-4 bg-gray-300 rounded w-24" />
            </div>
          ))}
        </div>
      </div>
      
      {/* Rows */}
      <div className="divide-y divide-gray-200">
        {Array.from({ length: rows }, (_, rowIndex) => (
          <div key={rowIndex} className="px-6 py-4">
            <div className="flex space-x-4">
              {Array.from({ length: cols }, (_, colIndex) => (
                <div key={colIndex} className="flex-1">
                  <Skeleton className="h-4 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-start space-x-4">
        <Skeleton className="w-12 h-12 bg-gray-300 rounded-lg" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-5 bg-gray-300 rounded w-3/4" />
          <Skeleton className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="space-y-2">
            <Skeleton className="h-3 bg-gray-200 rounded" />
            <Skeleton className="h-3 bg-gray-200 rounded w-5/6" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-8 bg-gray-300 rounded w-64" />
          <Skeleton className="h-4 bg-gray-200 rounded w-96" />
        </div>
        <Skeleton className="h-10 bg-gray-300 rounded w-32" />
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-4 bg-gray-200 rounded w-20" />
                <Skeleton className="h-8 bg-gray-300 rounded w-16" />
              </div>
              <Skeleton className="w-10 h-10 bg-gray-300 rounded-lg" />
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 2 }, (_, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
            <Skeleton className="h-6 bg-gray-300 rounded w-48 mb-4" />
            <Skeleton className="h-64 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const ProductListSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-8 bg-gray-300 rounded w-48" />
          <Skeleton className="h-4 bg-gray-200 rounded w-64" />
        </div>
        <Skeleton className="h-10 bg-gray-300 rounded w-32" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-3 bg-gray-200 rounded w-16" />
                <Skeleton className="h-6 bg-gray-300 rounded w-8" />
              </div>
              <Skeleton className="w-8 h-8 bg-gray-300 rounded-lg" />
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex gap-4">
          <Skeleton className="h-10 bg-gray-200 rounded flex-1" />
          <Skeleton className="h-10 bg-gray-200 rounded w-32" />
          <Skeleton className="h-10 bg-gray-200 rounded w-24" />
        </div>
      </div>

      {/* Table */}
      <TableSkeleton rows={8} cols={6} />
    </div>
  );
};

interface LoadingStateProps {
  type: 'dashboard' | 'table' | 'cards' | 'products' | 'custom';
  rows?: number;
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ 
  type, 
  rows = 5, 
  message = 'Loading...' 
}) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'dashboard':
        return <DashboardSkeleton />;
      case 'products':
        return <ProductListSkeleton />;
      case 'table':
        return <TableSkeleton rows={rows} />;
      case 'cards':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: rows }, (_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        );
      default:
        return (
          <div className="space-y-4">
            {Array.from({ length: rows }, (_, i) => (
              <Skeleton key={i} className="h-16 bg-gray-200 rounded-lg" />
            ))}
          </div>
        );
    }
  };

  return (
    <div className="animate-pulse">
      {renderSkeleton()}
    </div>
  );
};

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: Icon = CubeIcon,
  action,
}) => {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6 max-w-sm mx-auto">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

interface FullPageLoadingProps {
  message?: string;
}

export const FullPageLoading: React.FC<FullPageLoadingProps> = ({ 
  message = 'Loading...' 
}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="xl" className="mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">{message}</h3>
        <p className="text-gray-500">Please wait while we load your data</p>
      </div>
    </div>
  );
};

interface LoadingOverlayProps {
  isLoading: boolean;
  children: React.ReactNode;
  message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  children,
  message = 'Loading...',
}) => {
  if (!isLoading) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      {children}
      <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-3" />
          <p className="text-gray-600 font-medium">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default {
  LoadingSpinner,
  Skeleton,
  TableSkeleton,
  CardSkeleton,
  DashboardSkeleton,
  ProductListSkeleton,
  LoadingState,
  EmptyState,
  FullPageLoading,
  LoadingOverlay,
};