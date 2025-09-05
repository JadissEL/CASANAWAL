// =====================================================
// ADMIN TYPES - REFACTORED FROM SIMPLE-ALL.TS (≤150 lines)
// =====================================================

// Product update data interface
export interface ProductUpdateData {
  sku?: string;
  name?: string;
  description?: string;
  base_price?: number;
  category_id?: string;
  is_active?: boolean;
  is_vegetarian?: boolean;
  is_spicy?: boolean;
  prep_time_minutes?: number;
  main_image?: string;
  rating?: number;
  is_featured?: boolean;
  sort_order?: number;
  product_name?: string;
}

// Dashboard stats interface
export interface DashboardStats {
  total_orders: number;
  pending_orders: number;
  completed_orders: number;
  today_revenue: number;
}

// Order status type
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';

// Payment status type
export type PaymentStatus = 'pending' | 'verified' | 'failed' | 'receipt_requested';

// API response interface
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
