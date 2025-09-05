import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  text?: string;
  variant?: 'default' | 'primary' | 'secondary' | 'terracotta';
}

const SIZE_CLASSES = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
  xl: 'h-16 w-16'
} as const;

const VARIANT_CLASSES = {
  default: 'border-current',
  primary: 'border-primary',
  secondary: 'border-secondary',
  terracotta: 'border-terracotta'
} as const;

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className,
  text,
  variant = 'default'
}) => (
  <div className={cn('flex flex-col items-center justify-center', className)}>
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-t-transparent',
        SIZE_CLASSES[size],
        VARIANT_CLASSES[variant]
      )}
    />
    {text && (
      <p className="mt-2 text-sm text-muted-foreground">{text}</p>
    )}
  </div>
);

export const LoadingOverlay: React.FC<LoadingSpinnerProps> = ({
  className,
  ...props
}) => (
  <div className={cn(
    'fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm',
    className
  )}>
    <LoadingSpinner {...props} />
  </div>
);

// Data loading states
export const DataLoadingState: React.FC<{
  loading: boolean;
  error: string | null;
  children: React.ReactNode;
  loadingText?: string;
  errorText?: string;
  onRetry?: () => void;
  className?: string;
}> = ({
  loading,
  error,
  children,
  loadingText = "Chargement...",
  errorText = "Une erreur s'est produite",
  onRetry,
  className
}) => {
  if (loading) {
    return (
      <div className={cn('flex items-center justify-center min-h-[200px]', className)}>
        <LoadingSpinner
          size="lg"
          text={loadingText}
          variant="primary"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn('flex flex-col items-center justify-center min-h-[200px] text-center', className)}>
        <div className="text-red-500 mb-4">
          <AlertTriangleIcon className="h-12 w-12 mx-auto" />
        </div>
        <h3 className="text-lg font-semibold mb-2">{errorText}</h3>
        <p className="text-muted-foreground mb-4">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Réessayer
          </button>
        )}
      </div>
    );
  }

  return <>{children}</>;
};

// Simple alert triangle icon component using lucide-react
const AlertTriangleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <AlertTriangle className={className} />
);

// Refetch indicator
export const RefetchIndicator: React.FC<{
  isRefetching: boolean;
  children: React.ReactNode;
}> = ({ isRefetching, children }) => {
  return (
    <div className="relative">
      {children}
      {isRefetching && (
        <div className="absolute top-2 right-2 z-10">
          <div className="h-2 w-2 bg-primary rounded-full animate-pulse" />
        </div>
      )}
    </div>
  );
};
