export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  details?: any;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface Product {
  id: string;
  category_id: string;
  sku: string;
  base_price: number;
  is_vegetarian: boolean;
  is_spicy: boolean;
  rating: number;
  rating_count: number;
  prep_time_minutes: number;
  is_active: boolean;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  // Populated fields
  category_name?: string;
  name?: string;
  description?: string;
  preparation_time_text?: string;
  images?: ProductImage[];
  allergens?: ProductAllergen[];
  portions?: PortionPricing[];
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text?: string;
  sort_order: number;
  is_primary: boolean;
}

export interface ProductAllergen {
  id: string;
  product_id: string;
  allergen_code: string;
  allergen_name: string;
}

export interface PortionPricing {
  id: string;
  product_id: string;
  persons: number;
  discount_percentage: number;
  size_label: string;
}

export interface Order {
  id: string;
  reference: string;
  client_id?: string;
  status: 'pending_deposit' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  subtotal: number;
  discount_amount: number;
  delivery_fee: number;
  deposit_required: number;
  deposit_paid: number;
  total_amount: number;
  delivery_date: string;
  delivery_slot: string;
  delivery_address: string;
  notes?: string;
  metadata: any;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
  status_history?: OrderStatusHistory[];
  client?: {
    phone: string;
    email?: string;
    first_name?: string;
    last_name?: string;
  };
  payments?: {
    id: string;
    amount: number;
    status: string;
    payment_method: string;
    created_at: string;
  }[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id?: string;
  product_name_snapshot: string;
  quantity: number;
  portion_persons: number;
  unit_price: number;
  total_price: number;
  product_details_snapshot: any;
}

export interface OrderStatusHistory {
  id: string;
  order_id: string;
  status: string;
  comment?: string;
  changed_by?: string;
  changed_at: string;
}

// API Method Parameters
export interface GetProductsParams {
  category_id?: string;
  featured?: boolean;
  active?: boolean;
  page?: number;
  limit?: number;
}

export interface GetOrdersParams {
  status?: string;
  client_id?: string;
  page?: number;
  limit?: number;
  start_date?: string;
  end_date?: string;
}

export interface CreateOrderData {
  client_phone: string;
  client_email?: string;
  client_name?: string;
  subtotal: number;
  discount_amount?: number;
  delivery_fee: number;
  deposit_required: number;
  total_amount: number;
  delivery_date: string;
  delivery_slot: string;
  delivery_address: string;
  notes?: string;
  items: Omit<OrderItem, 'id' | 'order_id'>[];
}

export interface PaymentData {
  amount: number;
  payment_method: string;
  transaction_reference?: string;
  proof_file_url?: string;
  notes?: string;
}
