export interface RevenueByHour {
  hour: string;
  revenue: number;
  orders: number;
  customers: number;
}

export interface SalesByDay {
  day: string;
  revenue: number;
  orders: number;
  avgOrderValue: number;
}

export interface CustomerSegment {
  name: string;
  value: number;
  growth: number;
  color: string;
}

export interface TopCategory {
  category: string;
  revenue: number;
  orders: number;
  avgPrice: number;
  growth: number;
}

export interface PaymentMethod {
  method: string;
  value: number;
  amount: number;
  color: string;
}

export interface DeliveryZone {
  zone: string;
  orders: number;
  revenue: number;
  avgTime: number;
}

export interface PerformanceMetrics {
  conversionRate: number;
  avgOrderValue: number;
  customerRetention: number;
  orderFulfillmentTime: number;
  customerSatisfaction: number;
  cancelationRate: number;
}

export interface KPIMetric {
  title: string;
  value: number;
  suffix: string;
  change: string;
  changeType: 'increase' | 'decrease';
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

export interface AnalyticsData {
  revenueByHour: RevenueByHour[];
  salesByDay: SalesByDay[];
  customerSegments: CustomerSegment[];
  topCategories: TopCategory[];
  paymentMethods: PaymentMethod[];
  deliveryZones: DeliveryZone[];
  performanceMetrics: PerformanceMetrics;
}
