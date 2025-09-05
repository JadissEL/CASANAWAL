// =====================================================
// CUSTOMER RECOMMENDATION UTILITIES - EXTRACTED FROM CUSTOMER-RECOMMENDATION-HANDLERS.TS (≤150 lines)
// =====================================================

import { db } from "../../database/connection";

// Get customer's order history for collaborative filtering
export const getCustomerOrderHistory = async (customerId: string) => {
  const orderHistoryResult = await db.query(`
    SELECT DISTINCT oi.product_id
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    WHERE o.client_id = $1 AND o.status IN ('delivered', 'ready')
  `, [customerId]);

  return orderHistoryResult.rows.map(row => row.product_id);
};

// Get recommendations from favorite category
export const getCategoryRecommendations = async (favoriteCategory: string, orderedProductIds: any[], limit: number) => {
  const categoryRecommendations = await db.query(`
    SELECT 
      p.id,
      p.base_price,
      p.rating,
      p.rating_count,
      p.name,
      p.description,
      'favorite_category' as reason,
      (SELECT pi.image_url FROM product_images pi 
       WHERE pi.product_id = p.id AND pi.is_primary = true 
       LIMIT 1) as main_image
    FROM products p
    WHERE p.category_id = $1 
      AND p.is_active = true
      AND ($2::uuid[] IS NULL OR p.id != ALL($2))
    ORDER BY p.rating DESC, p.rating_count DESC
    LIMIT $3
  `, [
    favoriteCategory, 
    orderedProductIds.length > 0 ? orderedProductIds : null,
    limit
  ]);

  return categoryRecommendations.rows;
};

// Get collaborative filtering recommendations
export const getCollaborativeRecommendations = async (customerId: string, orderedProductIds: any[], limit: number) => {
  const collaborativeRecommendations = await db.query(`
    WITH similar_customers AS (
      SELECT DISTINCT o2.client_id, COUNT(*) as common_products
      FROM orders o1
      JOIN order_items oi1 ON o1.id = oi1.order_id
      JOIN order_items oi2 ON oi1.product_id = oi2.product_id
      JOIN orders o2 ON oi2.order_id = o2.id
      WHERE o1.client_id = $1 
        AND o2.client_id != $1
        AND oi1.product_id = ANY($2)
      GROUP BY o2.client_id
      HAVING COUNT(*) >= 2
      ORDER BY common_products DESC
      LIMIT 10
    ),
    recommended_products AS (
      SELECT DISTINCT oi.product_id, COUNT(*) as recommendation_score
      FROM similar_customers sc
      JOIN orders o ON sc.client_id = o.client_id
      JOIN order_items oi ON o.id = oi.order_id
      WHERE oi.product_id != ALL($2)
      GROUP BY oi.product_id
      ORDER BY recommendation_score DESC
      LIMIT $3
    )
    SELECT 
      p.id,
      p.base_price,
      p.rating,
      p.rating_count,
      p.name,
      p.description,
      'collaborative' as reason,
      (SELECT pi.image_url FROM product_images pi 
       WHERE pi.product_id = p.id AND pi.is_primary = true 
       LIMIT 1) as main_image
    FROM recommended_products rp
    JOIN products p ON rp.product_id = p.id
    WHERE p.is_active = true
    ORDER BY rp.recommendation_score DESC, p.rating DESC
  `, [customerId, orderedProductIds, limit]);

  return collaborativeRecommendations.rows;
};

// Get popular products to fill remaining slots
export const getPopularRecommendations = async (orderedProductIds: any[], existingRecommendations: any[], remainingSlots: number) => {
  const popularRecommendations = await db.query(`
    SELECT 
      p.id,
      p.base_price,
      p.rating,
      p.rating_count,
      p.name,
      p.description,
      'popular' as reason,
      (SELECT pi.image_url FROM product_images pi 
       WHERE pi.product_id = p.id AND pi.is_primary = true 
       LIMIT 1) as main_image
    FROM products p
    WHERE p.is_active = true
      AND ($1::uuid[] IS NULL OR p.id != ALL($1))
      AND NOT EXISTS (
        SELECT 1 FROM unnest($2::uuid[]) as rec_id WHERE rec_id = p.id
      )
    ORDER BY p.rating DESC, p.rating_count DESC, p.is_featured DESC
    LIMIT $3
  `, [
    orderedProductIds.length > 0 ? orderedProductIds : null,
    existingRecommendations.map(r => r.id),
    remainingSlots
  ]);

  return popularRecommendations.rows;
};
