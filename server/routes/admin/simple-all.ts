// =====================================================
// ADMIN SIMPLE ALL - REFACTORED FROM MONOLITHIC FILE (≤150 lines)
// Main export file that imports handlers from modular files
// =====================================================

// Import type definitions
export * from './admin-types.js';

// Import product handlers
import { 
  getAllProducts, 
  getProductById, 
  createProduct, 
  deleteProduct, 
  toggleProductStatus, 
  getProducts 
} from './admin-product-handlers.js';
import { updateProduct } from './admin-product-update.js';

// Import order handlers
import { 
  getAllOrders, 
  getOrderById, 
  updateOrderStatus, 
  getOrders 
} from './admin-order-handlers.js';

// Import customer handlers
import { 
  getAllCustomers, 
  getCustomerById 
} from './admin-customer-handlers.js';

// Import utility handlers
import {
  requestNewReceipt,
  getDashboardStats,
  getCategories,
  getPayments,
  verifyPayment
} from './admin-utility-handlers.js';

// Import offer handlers
import {
  getAllOffers,
  getOfferById,
  createOffer,
  updateOffer,
  deleteOffer,
  toggleOfferStatus,
  toggleOfferFeatured,
  getFeaturedOffers
} from './admin-offer-handlers.js';

// Re-export all handlers for backward compatibility
export {
  // Product management
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductStatus,
  getProducts,

  // Order management
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  getOrders,

  // Customer management
  getAllCustomers,
  getCustomerById,

  // Utility functions
  requestNewReceipt,
  getDashboardStats,
  getCategories,
  getPayments,
  verifyPayment,

  // Offer management
  getAllOffers,
  getOfferById,
  createOffer,
  updateOffer,
  deleteOffer,
  toggleOfferStatus,
  toggleOfferFeatured,
  getFeaturedOffers
};
