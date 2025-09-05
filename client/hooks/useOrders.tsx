// Orders hooks - Main composition file
// Re-export all types, hooks, and utilities for easy importing

// Re-export all types
export type {
  CreateOrderData,
  Order,
  OrderItem
} from './useOrders/types';

// Re-export utility functions
export { cartItemsToOrderItems } from './useOrders/utilities';

// Re-export core hooks
export {
  useCreateOrder,
  useOrder,
  useOrderByReference,
  useUpdateOrderStatus,
  useRecordPayment
} from './useOrders/core';

// Re-export validation utilities
export { useOrderValidation } from './useOrders/validation';
