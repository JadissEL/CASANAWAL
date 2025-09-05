import type { ProductVariant } from './products';

// Helper function for calculating portion price
export const calculatePortionPrice = (basePrice: number, variant: ProductVariant): number => {
  return variant.final_price || basePrice + (variant.price_modifier || 0);
};
