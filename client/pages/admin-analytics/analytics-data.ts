import { format, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { AnalyticsData } from './analytics-types';

export const analyticsData: AnalyticsData = {
  revenueByHour: Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}:00`,
    revenue: Math.floor(Math.random() * 500) + 100,
    orders: Math.floor(Math.random() * 20) + 5,
    customers: Math.floor(Math.random() * 15) + 3
  })),

  salesByDay: Array.from({ length: 7 }, (_, i) => ({
    day: format(subDays(new Date(), 6 - i), 'EEEE', { locale: fr }),
    revenue: Math.floor(Math.random() * 3000) + 1500,
    orders: Math.floor(Math.random() * 80) + 40,
    avgOrderValue: Math.floor(Math.random() * 50) + 30
  })),

  customerSegments: [
    { name: 'Nouveaux clients', value: 35, growth: 12, color: '#3B82F6' },
    { name: 'Clients réguliers', value: 45, growth: 8, color: '#10B981' },
    { name: 'Clients VIP', value: 20, growth: 15, color: '#F59E0B' }
  ],

  topCategories: [
    { category: 'Tajines', revenue: 15420, orders: 342, avgPrice: 45, growth: 12 },
    { category: 'Couscous', revenue: 12800, orders: 256, avgPrice: 50, growth: 8 },
    { category: 'Bastilla', revenue: 9640, orders: 184, avgPrice: 52, growth: -3 },
    { category: 'Grillades', revenue: 8970, orders: 168, avgPrice: 53, growth: 18 },
    { category: 'Desserts', revenue: 3250, orders: 125, avgPrice: 26, growth: 25 }
  ],

  paymentMethods: [
    { method: 'Virement bancaire', value: 45, amount: 18500, color: '#059669' },
    { method: 'Espèces à la livraison', value: 35, amount: 14200, color: '#DC2626' },
    { method: 'Carte bancaire', value: 20, amount: 8100, color: '#7C3AED' }
  ],

  deliveryZones: [
    { zone: 'Centre-ville', orders: 156, revenue: 7800, avgTime: 25 },
    { zone: 'Quartier administratif', orders: 134, revenue: 6950, avgTime: 30 },
    { zone: 'Zone industrielle', orders: 98, revenue: 4850, avgTime: 35 },
    { zone: 'Périphérie', orders: 67, revenue: 3200, avgTime: 45 }
  ],

  performanceMetrics: {
    conversionRate: 23.8,
    avgOrderValue: 87.5,
    customerRetention: 67.2,
    orderFulfillmentTime: 28.5,
    customerSatisfaction: 4.6,
    cancelationRate: 2.3
  }
};
