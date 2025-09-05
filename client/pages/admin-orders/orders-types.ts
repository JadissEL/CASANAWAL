export interface OrderFilters {
  status: string;
  search: string;
  date_range: string;
  page: number;
}

export interface OrderStats {
  total_orders: number;
  pending_orders: number;
  completed_orders: number;
  today_revenue: number;
}

export interface OrderPagination {
  total: number;
  page: number;
  pages: number;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Order {
  id: string;
  reference: string;
  client_phone?: string;
  delivery_address?: string;
  status: "pending" | "confirmed" | "preparing" | "ready" | "delivering" | "completed" | "cancelled";
  total_amount: number;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
  admin_notes?: string;
}

export interface StatusUpdate {
  orderId: string;
  status: string;
  notes: string;
}

export interface OrdersData {
  data: Order[];
  pagination: OrderPagination;
  stats: OrderStats;
}
