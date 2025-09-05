// =====================================================
// MENU QUERIES - REFACTORED FROM MONOLITHIC FILE (≤150 lines)
// Main export file that imports query builders from modular files
// =====================================================

// Import product-related queries
import { 
  buildMenuQuery, 
  buildCountQuery, 
  buildProductQuery, 
  buildRelatedProductsQuery 
} from './menu-product-queries.js';

// Import category and search queries
import { 
  buildCategoriesQuery, 
  buildStatsQuery, 
  buildFeaturedProductsQuery, 
  buildSearchSuggestionsQuery 
} from './menu-category-queries.js';

// Re-export all query builders for backward compatibility
export {
  buildMenuQuery,
  buildCountQuery,
  buildProductQuery,
  buildRelatedProductsQuery,
  buildCategoriesQuery,
  buildStatsQuery,
  buildFeaturedProductsQuery,
  buildSearchSuggestionsQuery
};
