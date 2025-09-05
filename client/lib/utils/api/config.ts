// Base API configuration
// Use absolute API base in production (e.g., from Netlify env), fallback to relative in dev
export const API_BASE_URL =
  (import.meta as any).env?.VITE_API_BASE?.replace(/\/$/, '') || '/api';

// Default fetch options
export const defaultOptions: RequestInit = {
  headers: {
    'Content-Type': 'application/json',
  },
};
