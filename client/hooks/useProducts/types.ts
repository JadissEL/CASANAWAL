// Legacy interfaces for backward compatibility
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  imageUrl: string;
  rating: number;
  preparationTime: string;
  category: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}

export interface MenuFilters {
  category?: string;
  search?: string;
  min_price?: number;
  max_price?: number;
  featured_only?: boolean;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

