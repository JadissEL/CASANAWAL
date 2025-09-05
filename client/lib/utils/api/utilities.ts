import type { ApiResponse } from './types';

// Utility functions for common API patterns
export function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });

  return searchParams.toString();
}

export function parseApiError(error: any): string {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  if (error?.error) return error.error;
  return 'An unexpected error occurred';
}

// Debounced API calls
export function createDebouncedApiCall<T>(
  apiFunction: (...args: any[]) => Promise<ApiResponse<T>>,
  delay: number = 300
) {
  let timeoutId: NodeJS.Timeout;

  return (...args: any[]) => {
    return new Promise<ApiResponse<T>>((resolve) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        apiFunction(...args).then(resolve);
      }, delay);
    });
  };
}
