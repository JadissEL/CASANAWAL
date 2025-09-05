// Dynamic Offers - Main composition file
// Re-export all types, functions, and utilities for easy importing

// Re-export all types
export type {
  MenuItem,
  MenuCategory,
  DynamicOffer
} from './dynamicOffers/types';

// Re-export main generator function
export { generateDynamicOffers } from './dynamicOffers/generators';

// Re-export utility functions
export {
  getCurrentSeason,
  getFeaturedItems
} from './dynamicOffers/utils';

// Re-export configuration constants for external access if needed
export { BUNDLE_CONFIGS, SEASONAL_OFFERS } from './dynamicOffers/configs';
