import type { ApiResponse } from './types';
import { API_BASE_URL, defaultOptions } from './config';

// Enhanced fetch with retry and quiet error handling in dev
export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  const config: RequestInit = {
    cache: 'no-store',
    keepalive: true,
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...(options.headers || {}),
    },
  };

  const maxAttempts = 3;
  let lastError: any = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await fetch(url, config);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      return data;
    } catch (err) {
      lastError = err;
      // Exponential backoff
      if (attempt < maxAttempts) {
        await new Promise((r) => setTimeout(r, attempt * 200));
        continue;
      }
    }
  }

  if (!(import.meta as any).env?.DEV) {
    // Only log outside dev
    console.error(`API Error (${endpoint}):`, lastError);
  }
  return {
    success: false,
    error: lastError instanceof Error ? lastError.message : 'Unknown error occurred',
  };
}

// GET request helper
export async function apiGet<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
  const url = params ? `${endpoint}?${new URLSearchParams(params)}` : endpoint;
  return apiFetch<T>(url, { method: 'GET' });
}

// POST request helper
export async function apiPost<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
  return apiFetch<T>(endpoint, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
}

// PUT request helper
export async function apiPut<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
  return apiFetch<T>(endpoint, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });
}

// DELETE request helper
export async function apiDelete<T>(endpoint: string): Promise<ApiResponse<T>> {
  return apiFetch<T>(endpoint, { method: 'DELETE' });
}

// PATCH request helper
export async function apiPatch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
  return apiFetch<T>(endpoint, {
    method: 'PATCH',
    body: data ? JSON.stringify(data) : undefined,
  });
}
