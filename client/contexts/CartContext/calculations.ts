import type { CartItem } from './types';

export interface CalculationResult {
  subtotal: number;
  total: number;
  discount: {
    percentage: number;
    amount: number;
    reason: string;
  };
}

// Helper function to calculate totals and discounts
export const calculateTotal = (items: CartItem[]): CalculationResult => {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Apply discount logic based on total amount
  let discountPercentage = 0;
  let discountReason = '';

  if (subtotal >= 200) {
    discountPercentage = 15;
    discountReason = 'Commande de 200 MAD ou plus';
  } else if (subtotal >= 100) {
    discountPercentage = 10;
    discountReason = 'Commande de 100 MAD ou plus';
  } else if (subtotal >= 50) {
    discountPercentage = 5;
    discountReason = 'Commande de 50 MAD ou plus';
  }

  const discountAmount = (subtotal * discountPercentage) / 100;
  const total = subtotal - discountAmount;

  return {
    subtotal,
    total,
    discount: {
      percentage: discountPercentage,
      amount: discountAmount,
      reason: discountReason
    }
  };
};

// Helper function to calculate total item count
export const calculateItemCount = (items: CartItem[]): number => {
  return items.reduce((sum, item) => sum + item.quantity, 0);
};
