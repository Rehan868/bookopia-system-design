
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({ 
  message = "Loading...", 
  fullScreen = false 
}) => {
  const content = (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative h-10 w-10">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        </div>
      </div>
      {message && <p className="text-muted-foreground">{message}</p>}
    </div>
  );
  
  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {content}
      </div>
    );
  }
  
  return content;
};

export const CardSkeleton = () => {
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="space-y-3">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
};

export const TableRowSkeleton = () => {
  return (
    <div className="flex items-center space-x-4 py-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
};
