// =====================================================
// PRODUCT & CATEGORY INTERFACES (Database-driven)
// =====================================================

export interface ProductImage {
  url: string;
  alt_text?: string;
  is_primary: boolean;
  sort_order?: number;
}

export interface ProductAllergen {
  code: string;
  name: string;
}

export interface ProductVariant {
  name: string;
  price_modifier: number;
  final_price: number;
  is_default?: boolean;
  sort_order?: number;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  base_price: number;
  is_vegetarian: boolean;
  is_spicy: boolean;
  rating: number;
  rating_count: number;
  prep_time_minutes: number;
  is_featured: boolean;
  sort_order: number;
  category_slug: string;
  category_name: string;
  category_icon: string;
  main_image?: string;
  images: ProductImage[];
  allergens: ProductAllergen[];
  portion_pricing: ProductVariant[];
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  slug: string;
  icon: string;
  name: string;
  description: string;
  product_count: number;
  sort_order?: number;
}

export interface ProductReview {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  client_name: string;
}

export interface ProductDetailResponse {
  success: boolean;
  data: {
    product: Product & {
      reviews?: ProductReview[];
    };
    related_products: Product[];
  };
}

export interface SearchSuggestion {
  name: string;
  type: 'product' | 'category';
  id: string;
  base_price?: number;
  image_url?: string;
}

export interface SearchSuggestionsResponse {
  success: boolean;
  data: {
    suggestions: SearchSuggestion[];
  };
}
