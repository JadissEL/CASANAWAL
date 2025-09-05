// =====================================================
// MENU PRODUCT QUERIES - REFACTORED FROM QUERIES.TS (≤150 lines)
// =====================================================

import { db } from "../../../database/connection";
import { 
  buildMenuSelectClause, 
  buildMenuFromClause, 
  buildMenuGroupByClause,
  buildProductSelectClause,
  buildProductFromClause,
  buildProductGroupByClause
} from './menu-query-utils.js';

// Main menu query with filtering and pagination
export const buildMenuQuery = (whereConditions: string[], params: any[], orderBy: string, limit: string, offset: string) => {
  const whereClause = whereConditions.join(' AND ');
  
  return {
    text: `
      ${buildMenuSelectClause()}
      ${buildMenuFromClause()}
      WHERE ${whereClause}
      ${buildMenuGroupByClause()}
      ORDER BY ${orderBy}
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `,
    values: [...params, parseInt(limit), parseInt(offset)]
  };
};

// Count query for pagination
export const buildCountQuery = (whereConditions: string[], params: any[]) => {
  const whereClause = whereConditions.join(' AND ');
  
  return {
    text: `
      SELECT COUNT(DISTINCT p.id) as total
      FROM products p
      JOIN categories c ON p.category_id = c.id AND c.is_active = true
      WHERE ${whereClause}
    `,
    values: [...params]
  };
};

// Single product query with full details
export const buildProductQuery = (id: string) => ({
  text: `
    ${buildProductSelectClause()}
    ${buildProductFromClause()}
    WHERE p.id = $1 AND p.is_active = true
    ${buildProductGroupByClause()}
  `,
  values: [id]
});

// Related products query
export const buildRelatedProductsQuery = (id: string, categoryId: string) => ({
  text: `
    SELECT 
      p.id,
      p.base_price,
      p.rating,
      p.rating_count,
      p.is_featured,
      p.name,
      p.description,
      (SELECT pi.image_url FROM product_images pi 
       WHERE pi.product_id = p.id AND pi.is_primary = true 
       LIMIT 1) as main_image
    FROM products p
    WHERE p.category_id = $2 
      AND p.id != $1 
      AND p.is_active = true
    ORDER BY p.rating DESC, p.rating_count DESC
    LIMIT 4
  `,
  values: [id, categoryId]
});
