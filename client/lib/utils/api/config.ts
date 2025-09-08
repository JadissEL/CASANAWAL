// Base API configuration
// Use relative API base for Vercel deployment
export const API_BASE_URL = '/api';

// Default fetch options
export const defaultOptions: RequestInit = {
  headers: {
    'Content-Type': 'application/json',
  },
};
