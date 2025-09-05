// =====================================================
// ADMIN ORDERS TYPES & INTERFACES (≤150 lines)
// =====================================================

export interface OrderFilters {
  status: string;
  search: string;
  date_range: string;
  page: number;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed';
  created_at: string;
  updated_at: string;
  items: OrderItem[];
  notes?: string;
  delivery_time?: string;
  payment_method?: string;
  discount_amount?: number;
  tax_amount?: number;
}

export interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  special_instructions?: string;
}

export interface OrderStats {
  total_orders: number;
  pending_orders: number;
  confirmed_orders: number;
  delivered_orders: number;
  total_revenue: number;
  average_order_value: number;
}

export interface BulkActionOptions {
  value: string;
  label: string;
  icon?: React.ComponentType<any>;
  variant?: 'default' | 'destructive' | 'success';
}

export interface OrderDetailsModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: (orderId: string, status: string) => void;
  onAddNote: (orderId: string, note: string) => void;
}

export interface OrderFiltersProps {
  filters: OrderFilters;
  onFiltersChange: (filters: Partial<OrderFilters>) => void;
  stats: OrderStats | null;
  isLoading: boolean;
}

export interface OrderTableProps {
  orders: Order[];
  selectedOrders: string[];
  onSelectOrder: (orderId: string) => void;
  onSelectAll: (checked: boolean) => void;
  onViewDetails: (order: Order) => void;
  onStatusChange: (orderId: string, status: string) => void;
  isLoading: boolean;
}

export interface OrderActionsProps {
  selectedOrders: string[];
  bulkAction: string;
  onBulkActionChange: (action: string) => void;
  onBulkActionExecute: () => void;
  onRefresh: () => void;
  onExport: () => void;
  isLoading: boolean;
}

export interface StatusBadgeProps {
  status: Order['status'];
  size?: 'sm' | 'md' | 'lg';
}

export interface PaymentStatusBadgeProps {
  status: Order['payment_status'];
  size?: 'sm' | 'md' | 'lg';
}

export const ORDER_STATUSES = [
  { value: 'all', label: 'Tous les statuts' },
  { value: 'pending', label: 'En attente', color: 'yellow' },
  { value: 'confirmed', label: 'Confirmé', color: 'blue' },
  { value: 'preparing', label: 'En préparation', color: 'orange' },
  { value: 'ready', label: 'Prêt', color: 'purple' },
  { value: 'delivered', label: 'Livré', color: 'green' },
  { value: 'cancelled', label: 'Annulé', color: 'red' }
];

export const DATE_RANGES = [
  { value: 'all', label: 'Toutes les dates' },
  { value: 'today', label: "Aujourd'hui" },
  { value: 'yesterday', label: 'Hier' },
  { value: 'this_week', label: 'Cette semaine' },
  { value: 'last_week', label: 'Semaine dernière' },
  { value: 'this_month', label: 'Ce mois' },
  { value: 'last_month', label: 'Mois dernier' }
];

export const BULK_ACTIONS: BulkActionOptions[] = [
  { value: '', label: 'Actions groupées' },
  { value: 'confirm', label: 'Confirmer les commandes', variant: 'success' },
  { value: 'prepare', label: 'Marquer en préparation', variant: 'default' },
  { value: 'ready', label: 'Marquer comme prêt', variant: 'default' },
  { value: 'deliver', label: 'Marquer comme livré', variant: 'success' },
  { value: 'cancel', label: 'Annuler les commandes', variant: 'destructive' },
  { value: 'export', label: 'Exporter la sélection', variant: 'default' },
  { value: 'print', label: 'Imprimer les tickets', variant: 'default' }
];

export const ITEMS_PER_PAGE = 20;
