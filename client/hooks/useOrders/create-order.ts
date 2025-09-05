import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/lib/api';
import { storeOrderLocally } from './local-storage';

// Create order hook
export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderData: Parameters<typeof apiService.createOrder>[0]) => {
      const response = await apiService.createOrder(orderData);

      if (!response.success) {
        throw new Error(response.error || 'Failed to create order');
      }

      return response.data!;
    },
    onSuccess: (order) => {
      // Invalidate and refetch orders
      queryClient.invalidateQueries({ queryKey: ['orders'] });

      // Store order locally as fallback (existing behavior)
      storeOrderLocally(order);
    },
  });
}
