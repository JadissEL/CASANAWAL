// Orders routes - Main composition file
// Re-export all schemas, queries, and handlers for easy importing

// Re-export validation schemas
export { OrderItemSchema, OrderCreateSchema } from './orders/schemas';

// Re-export query functions
export {
  getOrdersQuery,
  getOrderByReferenceQuery,
  createOrderQuery
} from './orders/queries';

// Re-export route handlers
export { getOrders, getOrder, createOrder } from './orders/handlers';