/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

// =====================================================
// SHARED API TYPES - Main composition file
// =====================================================

// Re-export demo types
export type { DemoResponse } from './api/demo';

// Re-export product and category types
export type {
  ProductImage,
  ProductAllergen,
  ProductVariant,
  Product,
  Category,
  ProductReview,
  ProductDetailResponse,
  SearchSuggestion,
  SearchSuggestionsResponse
} from './api/products';

// Re-export menu response types
export type { MenuResponse, MenuStatsResponse } from './api/menu';

// Re-export legacy compatibility types and functions
export type {
  PortionOption,
  MenuItem,
  MenuCategory
} from './api/legacy';

export {
  convertProductToMenuItem,
  convertCategoryToMenuCategory
} from './api/legacy';

// Re-export utility functions
export { calculatePortionPrice } from './api/utils';
