import { useQuery } from '@tanstack/react-query';
import { useAdminAuth } from '../useAdminAuth';
import type { DashboardStats } from './types';

// Main dashboard stats hook
export function useAdminDashboard() {
  const { token } = useAdminAuth();

  return useQuery<DashboardStats>({
    queryKey: ['adminDashboard'],
    queryFn: async () => {
      const response = await fetch('/api/admin/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch dashboard data');
      }

      return data.data;
    },
    enabled: !!token,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
}

// Hook for order management data
export function useOrderManagement(filters?: {
  status?: string;
  page?: number;
  limit?: number;
  start_date?: string;
  end_date?: string;
  search?: string;
}) {
  const { token } = useAdminAuth();

  const queryParams = new URLSearchParams();
  if (filters?.status) queryParams.set('status', filters.status);
  if (filters?.page) queryParams.set('page', filters.page.toString());
  if (filters?.limit) queryParams.set('limit', filters.limit.toString());
  if (filters?.start_date) queryParams.set('start_date', filters.start_date);
  if (filters?.end_date) queryParams.set('end_date', filters.end_date);
  if (filters?.search) queryParams.set('search', filters.search);

  return useQuery({
    queryKey: ['orderManagement', filters],
    queryFn: async () => {
      const response = await fetch(`/api/admin/orders/management?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch order management data');
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch order management data');
      }

      return data;
    },
    enabled: !!token,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

// Hook for content management data
export function useContentManagement(filters?: {
  category?: string;
  page?: number;
  limit?: number;
  search?: string;
}) {
  const { token } = useAdminAuth();

  const queryParams = new URLSearchParams();
  if (filters?.category) queryParams.set('category', filters.category);
  if (filters?.page) queryParams.set('page', filters.page.toString());
  if (filters?.limit) queryParams.set('limit', filters.limit.toString());
  if (filters?.search) queryParams.set('search', filters.search);

  return useQuery({
    queryKey: ['contentManagement', filters],
    queryFn: async () => {
      const response = await fetch(`/api/admin/content/management?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch content management data');
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch content management data');
      }

      return data;
    },
    enabled: !!token,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Hook for system settings
export function useSystemSettings() {
  const { token } = useAdminAuth();

  return useQuery({
    queryKey: ['systemSettings'],
    queryFn: async () => {
      const response = await fetch('/api/admin/settings', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch system settings');
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch system settings');
      }

      return data.data;
    },
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook for analytics data
export function useAnalytics(period: number = 30) {
  const { token } = useAdminAuth();

  return useQuery({
    queryKey: ['analytics', period],
    queryFn: async () => {
      const response = await fetch(`/api/admin/analytics?period=${period}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch analytics data');
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch analytics data');
      }

      return data.data;
    },
    enabled: !!token,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}
