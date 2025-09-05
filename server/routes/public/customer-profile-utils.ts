// =====================================================
// CUSTOMER PROFILE UTILITIES - EXTRACTED FROM CUSTOMER-PROFILE-HANDLERS.TS (≤150 lines)
// =====================================================

import { db } from "../../database/connection";

// Get customer with analytics data
export const getCustomerWithAnalytics = async (phone: string) => {
  const customerResult = await db.query(`
    SELECT 
      c.*,
      ca.segment,
      ca.lifetime_value,
      ca.avg_order_value,
      ca.order_frequency,
      ca.churn_risk_score,
      ca.satisfaction_score,
      ca.favorite_category_id,
      ca.favorite_products,
      ca.preferred_delivery_zones,
      ca.preferred_order_times,
      cat.name as favorite_category_name
    FROM clients c
    LEFT JOIN customer_analytics ca ON c.id = ca.client_id
    LEFT JOIN categories cat ON ca.favorite_category_id = cat.id
    WHERE c.phone = $1
  `, [phone]);

  return customerResult;
};

// Get customer's recent orders
export const getCustomerRecentOrders = async (customerId: string) => {
  const recentOrdersResult = await db.query(`
    SELECT 
      o.reference,
      o.status,
      o.total_amount,
      o.delivery_date,
      COUNT(oi.id) as item_count
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    WHERE o.client_id = $1
    GROUP BY o.id
    ORDER BY o.id DESC
    LIMIT 5
  `, [customerId]);

  return recentOrdersResult;
};

// Get customer's favorite products with details
export const getCustomerFavoriteProducts = async (favoriteProducts: any[]) => {
  if (!favoriteProducts || !Array.isArray(favoriteProducts)) {
    return [];
  }

  const favoriteProductsResult = await db.query(`
    SELECT 
      p.id,
      p.base_price,
      p.rating,
      p.name,
      p.description,
      (SELECT pi.image_url FROM product_images pi 
       WHERE pi.product_id = p.id AND pi.is_primary = true 
       LIMIT 1) as main_image
    FROM products p
    WHERE p.id = ANY($1) AND p.is_active = true
    ORDER BY p.rating DESC
  `, [favoriteProducts]);
  
  return favoriteProductsResult.rows;
};

// Get customer's delivery preferences
export const getCustomerDeliveryStats = async (customerId: string) => {
  const deliveryStatsResult = await db.query(`
    SELECT 
      metadata->>'zone' as delivery_zone,
      COUNT(*) as order_count,
      AVG(total_amount) as avg_amount
    FROM orders 
    WHERE client_id = $1 AND metadata->>'zone' IS NOT NULL
    GROUP BY metadata->>'zone'
    ORDER BY order_count DESC
  `, [customerId]);

  return deliveryStatsResult.rows;
};

// Format customer profile response
export const formatCustomerProfileResponse = (customer: any, recentOrders: any[], favoriteProducts: any[], deliveryStats: any[]) => {
  return {
    profile: {
      id: customer.id,
      phone: customer.phone,
      email: customer.email,
      first_name: customer.first_name,
      last_name: customer.last_name,
      default_address: customer.default_address,
      total_orders: customer.total_orders,
      total_spent: customer.total_spent,
      created_at: customer.created_at,
      last_order_at: customer.last_order_at,
      preferences: customer.preferences || {}
    },
    analytics: {
      segment: customer.segment,
      lifetime_value: customer.lifetime_value,
      avg_order_value: customer.avg_order_value,
      order_frequency: customer.order_frequency,
      churn_risk_score: customer.churn_risk_score,
      satisfaction_score: customer.satisfaction_score,
      favorite_category: {
        id: customer.favorite_category_id,
        name: customer.favorite_category_name
      },
      preferred_delivery_zones: customer.preferred_delivery_zones || [],
      preferred_order_times: customer.preferred_order_times || {}
    },
    recent_orders: recentOrders,
    favorite_products: favoriteProducts,
    delivery_stats: deliveryStats
  };
};
