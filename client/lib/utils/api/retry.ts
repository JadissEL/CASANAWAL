import type { ApiResponse } from './types';
import { apiFetch } from './core';

// Retry mechanism for failed requests
export async function apiFetchWithRetry<T>(
  endpoint: string,
  options: RequestInit = {},
  maxRetries: number = 3,
  delay: number = 1000
): Promise<ApiResponse<T>> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await apiFetch<T>(endpoint, options);
      if (result.success) {
        return result;
      }
      lastError = new Error(result.error || 'Request failed');
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
    }

    if (attempt < maxRetries) {
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }

  return {
    success: false,
    error: lastError?.message || 'Max retries exceeded',
  };
}
