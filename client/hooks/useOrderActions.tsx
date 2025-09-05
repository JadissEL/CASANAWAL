import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAdminAuth } from './useAdminAuth';
import toast from 'react-hot-toast';

interface UpdateOrderStatusParams {
  orderId: string;
  status: string;
  admin_notes?: string;
}

interface BulkUpdateOrdersParams {
  orderIds: string[];
  action: 'updateStatus' | 'delete';
  status?: string;
  notes?: string;
}

interface VerifyPaymentParams {
  paymentId: string;
  verified: boolean;
  admin_notes?: string;
}

export function useOrderActions() {
  const { token } = useAdminAuth();
  const queryClient = useQueryClient();

  const updateOrderStatus = useMutation({
    mutationFn: async ({ orderId, status, admin_notes }: UpdateOrderStatusParams) => {
      const response = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status, admin_notes })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de la mise à jour');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orderManagement'] });
      queryClient.invalidateQueries({ queryKey: ['adminDashboard'] });
      toast.success('Statut de commande mis à jour avec succès');
    },
    onError: (error) => {
      toast.error(error.message || 'Erreur lors de la mise à jour');
    }
  });

  const bulkUpdateOrders = useMutation({
    mutationFn: async ({ orderIds, action, status, notes }: BulkUpdateOrdersParams) => {
      const response = await fetch('/api/admin/orders/bulk', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ orderIds, action, status, notes })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de la mise à jour groupée');
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['orderManagement'] });
      queryClient.invalidateQueries({ queryKey: ['adminDashboard'] });
      toast.success(data.message || 'Commandes mises à jour avec succès');
    },
    onError: (error) => {
      toast.error(error.message || 'Erreur lors de la mise à jour groupée');
    }
  });

  const verifyPayment = useMutation({
    mutationFn: async ({ paymentId, verified, admin_notes }: VerifyPaymentParams) => {
      const response = await fetch(`/api/admin/payments/${paymentId}/verify`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ verified, admin_notes })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de la vérification');
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['orderManagement'] });
      queryClient.invalidateQueries({ queryKey: ['adminDashboard'] });
      toast.success(data.message || 'Paiement vérifié avec succès');
    },
    onError: (error) => {
      toast.error(error.message || 'Erreur lors de la vérification du paiement');
    }
  });

  return {
    updateOrderStatus,
    bulkUpdateOrders,
    verifyPayment,
    isUpdatingOrderStatus: updateOrderStatus.isPending,
    isBulkUpdating: bulkUpdateOrders.isPending,
    isVerifyingPayment: verifyPayment.isPending
  };
}
