// Error Boundary Components - Main composition file
// Re-export all error handling components and utilities

// Re-export all types
export type {
  ErrorBoundaryProps,
  ErrorBoundaryState,
  ErrorDisplayProps
} from './ErrorBoundary/types';

// Re-export main error boundary component
export { ErrorBoundary } from './ErrorBoundary/error-boundary';

// Re-export error display component
export { ErrorDisplay } from './ErrorBoundary/error-display';

// Re-export hooks
export { useErrorHandler } from './ErrorBoundary/hooks';

// Re-export utilities
export { withAsyncErrorBoundary } from './ErrorBoundary/utils';
