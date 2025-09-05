export interface Product {
  id: string;
  sku: string;
  base_price: number;
  category_id: string;
  category_name: string;
  product_name?: string;
  description?: string;
  is_active: boolean;
  is_vegetarian?: boolean;
  is_spicy?: boolean;
  is_featured?: boolean;
  prep_time_minutes?: number;
  sort_order?: number;
}

export interface Payment {
  id: string;
  order_reference?: string;
  amount: number;
  status: string;
  client_name?: string;
  receipt_url?: string;
}

export interface Order {
  id: string;
  reference?: string;
  status: string;
  total_amount: number;
  client_name?: string;
  client_phone?: string;
}

export interface Stats {
  total_orders: number;
  total_revenue: number;
  total_products: number;
  pending_payments: number;
}

export interface Offer {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  discount_percentage?: number;
  discount_amount?: number;
  original_price?: number;
  final_price?: number;
  items: any[];
  is_featured: boolean;
  is_active: boolean;
  sort_order?: number;
  valid_from?: string;
  valid_until?: string;
  created_at: string;
  updated_at: string;
}

export interface UpdateMessage {
  type: 'success' | 'error';
  text: string;
}

export type DashboardTab = 'stats' | 'products' | 'payments' | 'orders' | 'offers';
