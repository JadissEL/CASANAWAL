// Admin Dashboard hooks - Main composition file
// Re-export all types and hooks for easy importing

// Re-export all types
export type { DashboardStats } from './useAdminDashboard/types';

// Re-export core hooks
export {
  useAdminDashboard,
  useOrderManagement,
  useContentManagement,
  useSystemSettings,
  useAnalytics
} from './useAdminDashboard/core';
