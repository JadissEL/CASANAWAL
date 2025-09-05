export interface DashboardStats {
  orders: {
    total_orders: number;
    total_revenue: number;
    pending_orders: number;
    completed_orders: number;
    avg_order_value: number;
    requiring_action: number;
  };
  products: {
    total_products: number;
    active_products: number;
    featured_products: number;
    average_rating: number;
  };
  categories: Array<{
    id: string;
    name: string;
    product_count: number;
  }>;
  payments: {
    total_payments: number;
    verified_payments: number;
    pending_payments: number;
    total_verified_amount: number;
  };
  recent_orders: Array<{
    id: string;
    reference: string;
    status: string;
    total_amount: number;
    created_at: string;
    client_phone?: string;
  }>;
  period: {
    start: string;
    end: string;
  };
}

