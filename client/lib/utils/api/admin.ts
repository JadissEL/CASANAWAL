import type { ApiResponse } from './types';
import { apiFetch } from './core';

// Admin API helpers with authentication
export async function adminApiFetch<T>(
  endpoint: string,
  token: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const adminOptions = {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
    },
  };
  return apiFetch<T>(endpoint, adminOptions);
}

export async function adminApiGet<T>(
  endpoint: string,
  token: string,
  params?: Record<string, any>
): Promise<ApiResponse<T>> {
  const url = params ? `${endpoint}?${new URLSearchParams(params)}` : endpoint;
  return adminApiFetch<T>(url, token, { method: 'GET' });
}

export async function adminApiPost<T>(
  endpoint: string,
  token: string,
  data?: any
): Promise<ApiResponse<T>> {
  return adminApiFetch<T>(endpoint, token, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
}

export async function adminApiPut<T>(
  endpoint: string,
  token: string,
  data?: any
): Promise<ApiResponse<T>> {
  return adminApiFetch<T>(endpoint, token, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });
}

export async function adminApiDelete<T>(
  endpoint: string,
  token: string
): Promise<ApiResponse<T>> {
  return adminApiFetch<T>(endpoint, token, { method: 'DELETE' });
}
