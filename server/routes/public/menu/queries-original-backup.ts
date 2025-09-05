// =====================================================
// MENU QUERIES ORIGINAL BACKUP - REFACTORED TO ≤150 LINES (PROMPT.MD PHASE 1)
// Simplified query builders consolidated into single file
// =====================================================

import { db } from "../../../database/connection";

// Main menu query (simplified)
export const buildMenuQuerySimple = (whereConditions: string[], params: any[], orderBy: string, limit: string, offset: string) => {
  const whereClause = whereConditions.join(' AND ');
  return {
    text: `SELECT p.id, p.name, p.description, p.base_price, p.is_vegetarian, p.is_spicy, p.rating, c.slug as category_slug, c.name as category_name, (SELECT pi.image_url FROM product_images pi WHERE pi.product_id = p.id AND pi.is_primary = true LIMIT 1) as main_image FROM products p JOIN categories c ON p.category_id = c.id AND c.is_active = true WHERE ${whereClause} ORDER BY ${orderBy} LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
    values: [...params, parseInt(limit), parseInt(offset)]
  };
};

// Count query (simplified)
export const buildCountQuerySimple = (whereConditions: string[], params: any[]) => {
  const whereClause = whereConditions.join(' AND ');
  return { text: `SELECT COUNT(DISTINCT p.id) as total FROM products p JOIN categories c ON p.category_id = c.id AND c.is_active = true WHERE ${whereClause}`, values: [...params] };
};

// Categories query (simplified)
export const buildCategoriesQuerySimple = () => ({
  text: 'SELECT c.id, c.slug, c.icon, c.name, c.description, COUNT(p.id) as product_count FROM categories c LEFT JOIN products p ON c.id = p.category_id AND p.is_active = true WHERE c.is_active = true GROUP BY c.id, c.slug, c.icon, c.name, c.description, c.sort_order ORDER BY c.sort_order, c.name',
  values: []
});

// Single product query (simplified)
export const buildProductQuerySimple = (id: string) => ({
  text: 'SELECT p.*, c.slug as category_slug, c.name as category_name, c.icon as category_icon, (SELECT pi.image_url FROM product_images pi WHERE pi.product_id = p.id AND pi.is_primary = true LIMIT 1) as main_image FROM products p JOIN categories c ON p.category_id = c.id WHERE p.id = $1 AND p.is_active = true',
  values: [id]
});

// Related products query (simplified)
export const buildRelatedProductsQuerySimple = (id: string, categoryId: string) => ({
  text: 'SELECT p.id, p.base_price, p.rating, p.name, p.description, (SELECT pi.image_url FROM product_images pi WHERE pi.product_id = p.id AND pi.is_primary = true LIMIT 1) as main_image FROM products p WHERE p.category_id = $2 AND p.id != $1 AND p.is_active = true ORDER BY p.rating DESC LIMIT 4',
  values: [id, categoryId]
});

// Stats query (simplified)
export const buildStatsQuerySimple = () => ({
  text: 'SELECT COUNT(DISTINCT p.id) as total_products, COUNT(DISTINCT p.category_id) as total_categories, COUNT(DISTINCT CASE WHEN p.is_vegetarian = true THEN p.id END) as vegetarian_count, COUNT(DISTINCT CASE WHEN p.is_featured = true THEN p.id END) as featured_count, ROUND(AVG(p.rating), 2) as average_rating FROM products p WHERE p.is_active = true',
  values: []
});

// Featured products query (simplified)
export const buildFeaturedProductsQuerySimple = () => ({
  text: 'SELECT p.id, p.base_price, p.rating, p.name, p.description, c.name as category_name, (SELECT pi.image_url FROM product_images pi WHERE pi.product_id = p.id AND pi.is_primary = true LIMIT 1) as main_image FROM products p JOIN categories c ON p.category_id = c.id WHERE p.is_active = true AND p.is_featured = true ORDER BY p.rating DESC LIMIT 6',
  values: []
});

// Search suggestions query (simplified)
export const buildSearchSuggestionsQuerySimple = (searchTerm: string, limit: number) => ({
  text: 'SELECT DISTINCT p.name, \'product\' as type, p.id::text, p.base_price::numeric, (SELECT pi.image_url FROM product_images pi WHERE pi.product_id = p.id AND pi.is_primary = true LIMIT 1) as image_url FROM products p WHERE p.is_active = true AND p.name ILIKE $1 UNION ALL SELECT DISTINCT c.name, \'category\' as type, c.id::text, NULL::numeric as base_price, c.icon as image_url FROM categories c WHERE c.is_active = true AND c.name ILIKE $1 ORDER BY type, name LIMIT $2',
  values: [`%${searchTerm}%`, limit]
});

// Backward compatibility aliases
export { buildMenuQuerySimple as buildMenuQuery, buildCountQuerySimple as buildCountQuery, buildCategoriesQuerySimple as buildCategoriesQuery, buildProductQuerySimple as buildProductQuery, buildRelatedProductsQuerySimple as buildRelatedProductsQuery, buildStatsQuerySimple as buildStatsQuery, buildFeaturedProductsQuerySimple as buildFeaturedProductsQuery, buildSearchSuggestionsQuerySimple as buildSearchSuggestionsQuery };
