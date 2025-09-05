// Legacy interface for backward compatibility
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

export interface DynamicOffer {
  id: string;
  title: string;
  description: string;
  originalPrice: number;
  discountPrice: number;
  imageUrl: string;
  discount: number;
  rating: number;
  preparationTime: string;
  items: MenuItem[];
  category?: string;
  type: 'single' | 'bundle' | 'category' | 'seasonal';
}
