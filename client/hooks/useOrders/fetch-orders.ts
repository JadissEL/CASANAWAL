import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/lib/api';
import { getStoredOrder, storedOrderToApiFormat } from './local-storage';

// Get single order hook
export function useOrder(id: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      const response = await apiService.getOrder(id);

      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch order');
      }

      return response.data!;
    },
    enabled: enabled && !!id,
    staleTime: 30 * 1000, // 30 seconds
  });
}

// Get order by reference hook
export function useOrderByReference(reference: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['orderByReference', reference],
    queryFn: async () => {
      const response = await apiService.getOrderByReference(reference);

      if (!response.success) {
        // Fallback to local storage for existing orders
        const storedOrder = getStoredOrder(reference);
        if (storedOrder) {
          return storedOrderToApiFormat(storedOrder);
        }

        throw new Error(response.error || 'Order not found');
      }

      return response.data!;
    },
    enabled: enabled && !!reference,
    staleTime: 30 * 1000,
  });
}
