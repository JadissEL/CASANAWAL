// Cart Context - Main composition file
// Re-export all types, functions, and components for easy importing

// Re-export all types
export type {
  CartItem,
  CartState,
  CartAction,
  CartContextType
} from './CartContext/types';

// Re-export calculation utilities
export { calculateTotal, calculateItemCount } from './CartContext/calculations';

// Re-export reducer
export { cartReducer } from './CartContext/reducer';

// Re-export storage utilities
export { loadCartFromStorage, saveCartToStorage } from './CartContext/storage';

// Re-export context provider and hook
export { CartProvider, useCart } from './CartContext/provider';
