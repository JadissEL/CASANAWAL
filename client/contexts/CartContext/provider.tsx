import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { CartContextType, CartItem } from './types';
import { cartReducer } from './reducer';
import { loadCartFromStorage, saveCartToStorage } from './storage';

const CartContext = createContext<CartContextType | undefined>(undefined);

// Cart Provider Component
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    itemCount: 0,
    subtotal: 0,
    discount: { percentage: 0, amount: 0, reason: '' }
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedItems = loadCartFromStorage();
    if (savedItems.length > 0) {
      dispatch({ type: 'LOAD_CART', payload: savedItems });
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    saveCartToStorage(state.items);
  }, [state.items]);

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getItemQuantity = (id: string) => {
    const item = state.items.find(item => item.id === id);
    return item ? item.quantity : 0;
  };

  const value: CartContextType = {
    state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItemQuantity
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
