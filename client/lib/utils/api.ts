// API utilities - Main composition file
// Re-export all types, functions, and utilities for easy importing

// Re-export all types
export type {
  ApiResponse,
  PaginationData,
  ApiError
} from './api/types';

// Re-export configuration
export { API_BASE_URL, defaultOptions } from './api/config';

// Re-export core API functions
export {
  apiFetch,
  apiGet,
  apiPost,
  apiPut,
  apiDelete,
  apiPatch
} from './api/core';

// Re-export admin API functions
export {
  adminApiFetch,
  adminApiGet,
  adminApiPost,
  adminApiPut,
  adminApiDelete
} from './api/admin';

// Re-export cache utilities
export {
  getCachedResponse,
  setCachedResponse,
  clearApiCache
} from './api/cache';

// Re-export retry mechanism
export { apiFetchWithRetry } from './api/retry';

// Re-export utility functions
export {
  buildQueryString,
  parseApiError,
  createDebouncedApiCall
} from './api/utilities';
