// Products hooks - Main composition file
// Re-export all types, hooks, and utilities for easy importing

// Re-export all types
export type {
  MenuItem,
  MenuCategory,
  MenuFilters
} from './useProducts/types';

// Re-export core hooks
export {
  useMenuData,
  useMenuStats,
  useSearchSuggestions
} from './useProducts/core';

// Re-export legacy compatibility hooks
export {
  useLegacyMenuData,
  getAllMenuItems,
  getMenuCategories
} from './useProducts/legacy';

// Re-export utility functions
export {
  calculatePortionPrice,
  searchMenuItems,
  filterMenuItemsByPrice,
  getMenuItemsByCategory
} from './useProducts/utilities';
