import type { CartItem } from '@/contexts/CartContext';
import type { OrderItem } from './types';

// Convert cart items to order items format
export function cartItemsToOrderItems(cartItems: CartItem[]): Omit<OrderItem, 'id' | 'order_id'>[] {
  return cartItems.map(item => ({
    product_id: item.id,
    product_name_snapshot: item.name,
    quantity: item.quantity,
    portion_persons: 1, // This should be enhanced based on portion selection
    unit_price: item.price,
    total_price: item.price * item.quantity,
    product_details_snapshot: {
      image: item.image,
      category: item.category
    }
  }));
}

