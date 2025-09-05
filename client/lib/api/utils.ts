import type {
  Product,
  ProductImage,
  ProductAllergen,
  PortionPricing
} from './types';

// Helper methods for converting legacy data structures
export const convertLegacyProductToAPIProduct = (legacyProduct: any): Product => {
  return {
    id: legacyProduct.id,
    category_id: legacyProduct.category || '',
    sku: legacyProduct.id,
    base_price: legacyProduct.basePrice,
    is_vegetarian: legacyProduct.isVegetarian || false,
    is_spicy: legacyProduct.isSpicy || false,
    rating: legacyProduct.rating,
    rating_count: 0,
    prep_time_minutes: parseInt(legacyProduct.preparationTime.replace(/\D/g, '')) || 30,
    is_active: true,
    is_featured: false,
    sort_order: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    name: legacyProduct.name,
    description: legacyProduct.description,
    preparation_time_text: legacyProduct.preparationTime,
    images: [{
      id: '',
      product_id: legacyProduct.id,
      image_url: legacyProduct.imageUrl,
      alt_text: `Image de ${legacyProduct.name}`,
      sort_order: 0,
      is_primary: true
    }],
    allergens: legacyProduct.allergens?.map((allergen: string) => ({
      id: '',
      product_id: legacyProduct.id,
      allergen_code: allergen.toLowerCase().replace(/\s+/g, '_'),
      allergen_name: allergen
    })) || [],
    portions: legacyProduct.portionOptions?.map((portion: any) => ({
      id: '',
      product_id: legacyProduct.id,
      persons: portion.persons,
      discount_percentage: portion.discount,
      size_label: portion.sizeFr
    })) || []
  };
};

// Calculate portion price (migrated from menuData.ts)
export const calculatePortionPrice = (basePrice: number, portion: PortionPricing): number => {
  const totalBasePrice = basePrice * portion.persons;
  const discountAmount = (totalBasePrice * portion.discount_percentage) / 100;
  return Math.round(totalBasePrice - discountAmount);
};
