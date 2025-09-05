import type { CartState, CartAction } from './types';
import { calculateTotal, calculateItemCount } from './calculations';

export const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id);

      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        const calculations = calculateTotal(updatedItems);
        return {
          ...state,
          items: updatedItems,
          total: calculations.total,
          subtotal: calculations.subtotal,
          discount: calculations.discount,
          itemCount: calculateItemCount(updatedItems)
        };
      } else {
        const updatedItems = [...state.items, { ...action.payload, quantity: 1 }];
        const calculations = calculateTotal(updatedItems);
        return {
          ...state,
          items: updatedItems,
          total: calculations.total,
          subtotal: calculations.subtotal,
          discount: calculations.discount,
          itemCount: calculateItemCount(updatedItems)
        };
      }
    }

    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter(item => item.id !== action.payload);
      const calculations = calculateTotal(updatedItems);
      return {
        ...state,
        items: updatedItems,
        total: calculations.total,
        subtotal: calculations.subtotal,
        discount: calculations.discount,
        itemCount: calculateItemCount(updatedItems)
      };
    }

    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        const updatedItems = state.items.filter(item => item.id !== action.payload.id);
        const calculations = calculateTotal(updatedItems);
        return {
          ...state,
          items: updatedItems,
          total: calculations.total,
          subtotal: calculations.subtotal,
          discount: calculations.discount,
          itemCount: calculateItemCount(updatedItems)
        };
      } else {
        const updatedItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        );
        const calculations = calculateTotal(updatedItems);
        return {
          ...state,
          items: updatedItems,
          total: calculations.total,
          subtotal: calculations.subtotal,
          discount: calculations.discount,
          itemCount: calculateItemCount(updatedItems)
        };
      }
    }

    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        total: 0,
        subtotal: 0,
        discount: { percentage: 0, amount: 0, reason: '' },
        itemCount: 0
      };

    case 'LOAD_CART':
      const calculations = calculateTotal(action.payload);
      return {
        ...state,
        items: action.payload,
        total: calculations.total,
        subtotal: calculations.subtotal,
        discount: calculations.discount,
        itemCount: calculateItemCount(action.payload)
      };

    default:
      return state;
  }
};
