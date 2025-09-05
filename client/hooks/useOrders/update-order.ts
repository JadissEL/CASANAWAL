import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/lib/api';
import type { Order } from './types';

// Update order status hook
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
      comment
    }: {
      id: string;
      status: Order['status'];
      comment?: string;
    }) => {
      const response = await apiService.updateOrderStatus(id, status, comment);

      if (!response.success) {
        throw new Error(response.error || 'Failed to update order status');
      }

      return response.data!;
    },
    onSuccess: (order) => {
      // Update the specific order query
      queryClient.setQueryData(['order', order.id], order);
      queryClient.setQueryData(['orderByReference', order.reference], order);

      // Invalidate orders list
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

// Record payment hook
export function useRecordPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      orderId,
      paymentData
    }: {
      orderId: string;
      paymentData: {
        amount: number;
        payment_method: string;
        transaction_reference?: string;
        proof_file_url?: string;
        notes?: string;
      }
    }) => {
      const response = await apiService.recordPayment(orderId, paymentData);

      if (!response.success) {
        throw new Error(response.error || 'Failed to record payment');
      }

      return response.data!;
    },
    onSuccess: (order) => {
      // Update related queries
      queryClient.setQueryData(['order', order.id], order);
      queryClient.setQueryData(['orderByReference', order.reference], order);
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}
