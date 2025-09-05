import type { CartItem } from '@/contexts/CartContext';
import type { Order, OrderItem } from '@/lib/api';

export interface CreateOrderData {
  client_phone: string;
  client_email?: string;
  client_name?: string;
  subtotal: number;
  discount_amount?: number;
  delivery_fee: number;
  deposit_required: number;
  total_amount: number;
  delivery_date: string;
  delivery_slot: string;
  delivery_address: string;
  notes?: string;
  items: Omit<OrderItem, 'id' | 'order_id'>[];
}

// Re-export types from API for convenience
export type { Order, OrderItem };

