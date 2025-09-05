// =====================================================
// MENU CATEGORY QUERIES - REFACTORED FROM QUERIES.TS (≤150 lines)
// =====================================================

import { db } from "../../../database/connection";

// Categories query with product counts
export const buildCategoriesQuery = () => ({
  text: `
    SELECT 
      c.id,
      c.slug,
      c.icon,
      c.name,
      c.description,
      COUNT(p.id) as product_count
    FROM categories c
    LEFT JOIN products p ON c.id = p.category_id AND p.is_active = true
    WHERE c.is_active = true
    GROUP BY c.id, c.slug, c.icon, c.name, c.description, c.sort_order
    ORDER BY c.sort_order, c.name
  `,
  values: []
});

// Menu statistics query
export const buildStatsQuery = () => ({
  text: `
    SELECT 
      COUNT(DISTINCT p.id) as total_products,
      COUNT(DISTINCT p.category_id) as total_categories,
      COUNT(DISTINCT CASE WHEN p.is_vegetarian = true THEN p.id END) as vegetarian_count,
      COUNT(DISTINCT CASE WHEN p.is_featured = true THEN p.id END) as featured_count,
      ROUND(AVG(p.rating), 2) as average_rating,
      0 as total_reviews
    FROM products p
    WHERE p.is_active = true
  `,
  values: []
});

// Featured products query
export const buildFeaturedProductsQuery = () => ({
  text: `
    SELECT 
      p.id,
      p.base_price,
      p.rating,
      p.rating_count,
      p.name,
      p.description,
      c.name as category_name,
      (SELECT pi.image_url FROM product_images pi 
       WHERE pi.product_id = p.id AND pi.is_primary = true 
       LIMIT 1) as main_image
    FROM products p
    JOIN categories c ON p.category_id = c.id
    WHERE p.is_active = true AND p.is_featured = true
    ORDER BY p.sort_order, p.rating DESC
    LIMIT 6
  `,
  values: []
});

// Search suggestions query
export const buildSearchSuggestionsQuery = (searchTerm: string, limit: number) => ({
  text: `
    SELECT DISTINCT
      p.name,
      'product' as type,
      p.id::text,
      p.base_price::numeric,
      (SELECT pi.image_url FROM product_images pi 
       WHERE pi.product_id = p.id AND pi.is_primary = true 
       LIMIT 1) as image_url
    FROM products p
    WHERE p.is_active = true 
      AND p.name ILIKE $1
    
    UNION ALL
    
    SELECT DISTINCT
      c.name,
      'category' as type,
      c.id::text,
      NULL::numeric as base_price,
      c.icon as image_url
    FROM categories c
    WHERE c.is_active = true 
      AND c.name ILIKE $1
    
    ORDER BY type, name
    LIMIT $2
  `,
  values: [`%${searchTerm}%`, limit]
});
