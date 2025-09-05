// API service layer - Main composition file
// Re-export all types and services for easy importing

// Import services and utilities for internal use
import { productsAPIService } from './api/products-service';
import { ordersAPIService } from './api/orders-service';
import { convertLegacyProductToAPIProduct, calculatePortionPrice } from './api/utils';

// Re-export all types
export type {
  APIResponse,
  Product,
  ProductImage,
  ProductAllergen,
  PortionPricing,
  Order,
  OrderItem,
  OrderStatusHistory,
  GetProductsParams,
  GetOrdersParams,
  CreateOrderData,
  PaymentData
} from './api/types';

// Re-export services
export { productsAPIService } from './api/products-service';
export { ordersAPIService } from './api/orders-service';

// Re-export utilities
export {
  convertLegacyProductToAPIProduct,
  calculatePortionPrice
} from './api/utils';

// Legacy compatibility - create a combined service that maintains the old API
class CombinedAPIService {
  // Product methods
  async getProducts(params?: any) {
    return productsAPIService.getProducts(params);
  }

  async getProduct(id: string) {
    return productsAPIService.getProduct(id);
  }

  async searchProducts(query: string) {
    return productsAPIService.searchProducts(query);
  }

  // Order methods
  async createOrder(orderData: any) {
    return ordersAPIService.createOrder(orderData);
  }

  async getOrderByReference(reference: string) {
    return ordersAPIService.getOrderByReference(reference);
  }

  async getOrders(params?: any) {
    return ordersAPIService.getOrders(params);
  }

  async getOrder(id: string) {
    return ordersAPIService.getOrder(id);
  }

  async updateOrderStatus(id: string, status: any, comment?: string) {
    return ordersAPIService.updateOrderStatus(id, status, comment);
  }

  async recordPayment(orderId: string, paymentData: any) {
    return ordersAPIService.recordPayment(orderId, paymentData);
  }

  // Utility methods
  convertLegacyProductToAPIProduct = convertLegacyProductToAPIProduct;
  calculatePortionPrice = calculatePortionPrice;
}

// Export legacy-compatible service for backward compatibility
export const apiService = new CombinedAPIService();
export default apiService;
