import type { Product } from '@/lib/api';

// Utility functions
export function calculatePortionPrice(basePrice: number, variant: { price_modifier: number }): number {
  return basePrice + variant.price_modifier;
}

export function searchMenuItems(products: Product[], query: string): Product[] {
  const lowercaseQuery = query.toLowerCase();
  return products.filter(product =>
    product.name.toLowerCase().includes(lowercaseQuery) ||
    product.description.toLowerCase().includes(lowercaseQuery) ||
    product.category_name.toLowerCase().includes(lowercaseQuery)
  );
}

export function filterMenuItemsByPrice(products: Product[], minPrice: number, maxPrice: number): Product[] {
  return products.filter(product => {
    const singlePortionPrice = product.base_price;
    return singlePortionPrice >= minPrice && singlePortionPrice <= maxPrice;
  });
}

export function getMenuItemsByCategory(products: Product[], categorySlug: string): Product[] {
  return products.filter(product => product.category_slug === categorySlug);
}

