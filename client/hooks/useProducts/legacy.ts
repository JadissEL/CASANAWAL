import type { MenuFilters, MenuItem, MenuCategory } from './types';
import { useMenuData } from './core';
import type { MenuResponse } from '@/lib/api';

// Legacy hook for backward compatibility
export function useLegacyMenuData(filters: MenuFilters = {}) {
  const { data, loading, error } = useMenuData(filters);

  // Simple conversion without external dependencies
  const legacyData = data ? {
    products: data.products.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description,
      basePrice: product.base_price,
      imageUrl: product.main_image || '',
      rating: product.rating || 0,
      preparationTime: `${product.prep_time_minutes || 0} min`,
      category: product.category_name
    })),
    categories: data.categories.map(category => ({
      id: category.id,
      name: category.name,
      items: data.products
        .filter(product => product.category_slug === category.slug)
        .map(product => ({
          id: product.id,
          name: product.name,
          description: product.description,
          basePrice: product.base_price,
          imageUrl: product.main_image || '',
          rating: product.rating || 0,
          preparationTime: `${product.prep_time_minutes || 0} min`,
          category: product.category_name
        }))
    })),
    pagination: data.pagination,
    filters: data.filters
  } : null;

  return { data: legacyData, loading, error };
}

// Legacy functions for backward compatibility
export function getAllMenuItems(): MenuItem[] {
  // This function is deprecated - use useMenuData hook instead
  console.warn('getAllMenuItems is deprecated. Use useMenuData hook instead.');
  return [];
}

export function getMenuCategories(): MenuCategory[] {
  // This function is deprecated - use useMenuData hook instead
  console.warn('getMenuCategories is deprecated. Use useMenuData hook instead.');
  return [];
}

