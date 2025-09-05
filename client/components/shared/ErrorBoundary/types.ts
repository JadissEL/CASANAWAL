import { ErrorInfo, ReactNode } from 'react';

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export interface ErrorDisplayProps {
  error: Error;
  onRetry?: () => void;
  onDismiss?: () => void;
  variant?: 'inline' | 'card' | 'alert';
}
