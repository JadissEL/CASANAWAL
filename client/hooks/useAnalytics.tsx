import { useQuery, UseQueryResult } from '@tanstack/react-query';

interface AnalyticsData {
  daily_analytics: Array<{
    analytics_date: string;
    total_orders: number;
    total_revenue: number;
    total_customers: number;
    new_customers: number;
    avg_order_value: number;
    conversion_rate: number;
    cancellation_rate: number;
    payment_breakdown: Record<string, number>;
    status_breakdown: Record<string, number>;
    zone_performance: Record<string, { orders: number; revenue: number }>;
  }>;
  hourly_analytics: Array<{
    analytics_datetime: string;
    hour_of_day: number;
    orders_count: number;
    revenue: number;
    customers_count: number;
    avg_preparation_time: number;
    conversion_rate: number;
  }>;
  product_analytics: Array<{
    product_id: string;
    analytics_date: string;
    views_count: number;
    orders_count: number;
    revenue: number;
    avg_rating: number;
    conversion_rate: number;
  }>;
  customer_analytics: Array<{
    client_id: string;
    segment: string;
    lifetime_value: number;
    avg_order_value: number;
    order_frequency: number;
    churn_risk_score: number;
    satisfaction_score: number;
  }>;
  zone_analytics: Array<{
    zone_name: string;
    analytics_date: string;
    orders_count: number;
    revenue: number;
    avg_delivery_time: number;
    customer_satisfaction: number;
    delivery_success_rate: number;
    profitability_score: number;
  }>;
  realtime_metrics: Array<{
    metric_name: string;
    metric_value: number;
    metric_metadata: Record<string, any>;
    last_updated: string;
  }>;
}

const fetchAnalytics = async (period: number = 30): Promise<AnalyticsData> => {
  const response = await fetch(`/api/admin/analytics?period=${period}`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch analytics data');
  }

  return response.json();
};

export const useAnalytics = (period: number = 30): UseQueryResult<AnalyticsData, Error> => {
  return useQuery({
    queryKey: ['admin-analytics', period],
    queryFn: () => fetchAnalytics(period),
    refetchInterval: 30000, // Refetch every 30 seconds for real-time data
    staleTime: 15000, // Data is considered stale after 15 seconds
  });
};

// Hook for dashboard overview (more frequent updates)
export const useRealtimeMetrics = (): UseQueryResult<AnalyticsData['realtime_metrics'], Error> => {
  return useQuery({
    queryKey: ['realtime-metrics'],
    queryFn: async () => {
      const response = await fetch('/api/admin/dashboard/realtime', {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch realtime metrics');
      }
      
      return response.json();
    },
    refetchInterval: 10000, // Update every 10 seconds
    staleTime: 5000, // Data is stale after 5 seconds
  });
};

export default useAnalytics;
