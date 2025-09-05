import type { CartItem } from './types';

const CART_STORAGE_KEY = 'casanawal-cart';

// Load cart from localStorage
export const loadCartFromStorage = (): CartItem[] => {
  const savedCart = localStorage.getItem(CART_STORAGE_KEY);
  if (savedCart) {
    try {
      return JSON.parse(savedCart);
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      return [];
    }
  }
  return [];
};

// Save cart to localStorage
export const saveCartToStorage = (items: CartItem[]): void => {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
};
