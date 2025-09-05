// =====================================================
// CUSTOMERS API - REFACTORED FROM MONOLITHIC FILE (≤150 lines)
// Main export file that imports handlers from modular files
// =====================================================

// Import handlers from modular files
import { 
  getCustomerProfile, 
  updateCustomerProfile 
} from './customer-profile-handlers.js';
import { addCustomerReview } from './customer-review-handlers.js';
import { getCustomerRecommendations } from './customer-recommendation-handlers.js';
import { getCustomerLoyalty } from './customer-loyalty-handlers.js';

// Re-export all handlers for backward compatibility
export {
  getCustomerProfile,
  updateCustomerProfile,
  addCustomerReview,
  getCustomerRecommendations,
  getCustomerLoyalty
};
