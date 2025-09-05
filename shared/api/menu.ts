import type { Product, Category } from './products';

export interface MenuResponse {
  success: boolean;
  data: {
    products: Product[];
    categories: Category[];
    pagination: {
      current_page: number;
      per_page: number;
      total: number;
      total_pages: number;
      has_next: boolean;
      has_prev: boolean;
    };
    filters: {
      category?: string;
      search?: string;
      is_vegetarian?: boolean;
      is_spicy?: boolean;
      min_price?: number;
      max_price?: number;
      sort_by?: string;
      sort_order?: string;
      featured_only?: boolean;
    };
  };
}

export interface MenuStatsResponse {
  success: boolean;
  data: {
    stats: {
      total_products: number;
      total_categories: number;
      vegetarian_count: number;
      featured_count: number;
      average_rating: number;
      total_reviews: number;
    };
    featured_products: Product[];
  };
}
