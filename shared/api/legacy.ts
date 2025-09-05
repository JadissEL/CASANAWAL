import type { Product, Category, ProductVariant } from './products';

// =====================================================
// LEGACY INTERFACES (For backward compatibility during transition)
// =====================================================

// These interfaces are kept for backward compatibility during the transition
// They will be removed once all components are updated to use the new interfaces

export interface PortionOption {
  size: string;
  discount: number; // percentage discount
  persons: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  basePrice: number; // Price for 1 person in MAD
  category: string;
  imageUrl: string;
  rating: number;
  preparationTime: string;
  isVegetarian?: boolean;
  isSpicy?: boolean;
  allergens?: string[];
  portionOptions: PortionOption[];
}

export interface MenuCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  items: MenuItem[];
}

// Helper function to convert database Product to legacy MenuItem format
export const convertProductToMenuItem = (product: Product): MenuItem => {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    basePrice: product.base_price,
    category: product.category_name,
    imageUrl: product.main_image || '',
    rating: product.rating,
    preparationTime: `${product.prep_time_minutes} min`,
    isVegetarian: product.is_vegetarian,
    isSpicy: product.is_spicy,
    allergens: product.allergens.map(a => a.name),
    portionOptions: product.portion_pricing.map((variant, index) => ({
      size: variant.name,
      discount: 0, // Calculate discount based on price modifier
      persons: index + 1
    }))
  };
};

// Helper function to convert database Category to legacy MenuCategory format
export const convertCategoryToMenuCategory = (category: Category, products: Product[]): MenuCategory => {
  return {
    id: category.id,
    name: category.name,
    description: category.description,
    icon: category.icon,
    items: products
      .filter(p => p.category_slug === category.slug)
      .map(convertProductToMenuItem)
  };
};
