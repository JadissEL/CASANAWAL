// =====================================================
// MENU QUERY UTILITIES - EXTRACTED FROM MENU-PRODUCT-QUERIES.TS (≤150 lines)
// =====================================================

// Build complex SELECT clause for menu queries
export const buildMenuSelectClause = () => `
  SELECT 
    p.id,
    p.sku,
    p.name,
    p.description,
    p.base_price,
    p.is_vegetarian,
    p.is_spicy,
    p.rating,
    p.rating_count,
    p.prep_time_minutes,
    p.is_featured,
    p.sort_order,
    c.slug as category_slug,
    c.name as category_name,
    c.icon as category_icon,
    
    -- Main product image
    (SELECT pi.image_url FROM product_images pi 
     WHERE pi.product_id = p.id AND pi.is_primary = true 
     LIMIT 1) as main_image,
    
    -- All product images
    COALESCE(
      json_agg(
        jsonb_build_object(
          'url', pi2.image_url,
          'alt_text', pi2.alt_text,
          'is_primary', pi2.is_primary
        )
      ) FILTER (WHERE pi2.id IS NOT NULL),
      '[]'
    ) as images,
    
    -- Allergens (using product_allergens table)
    COALESCE(
      json_agg(
        jsonb_build_object(
          'code', pa.allergen_code,
          'name', pa.allergen_name
        )
      ) FILTER (WHERE pa.id IS NOT NULL),
      '[]'
    ) as allergens,
    
    -- Portion pricing (using portion_pricing table)
    COALESCE(
      json_agg(
        jsonb_build_object(
          'name', pp.size_label,
          'persons', pp.persons,
          'discount_percentage', pp.discount_percentage,
          'final_price', p.base_price * (1 - pp.discount_percentage / 100)
        )
      ) FILTER (WHERE pp.id IS NOT NULL),
      '[]'
    ) as portion_pricing`;

// Build FROM clause with joins for menu queries
export const buildMenuFromClause = () => `
  FROM products p
  JOIN categories c ON p.category_id = c.id AND c.is_active = true
  LEFT JOIN product_images pi2 ON p.id = pi2.product_id
  LEFT JOIN product_allergens pa ON p.id = pa.product_id
  LEFT JOIN portion_pricing pp ON p.id = pp.product_id`;

// Build GROUP BY clause for menu queries
export const buildMenuGroupByClause = () => `
  GROUP BY p.id, p.name, p.description, p.prep_time_minutes, 
           c.slug, c.name, c.icon, p.sort_order, p.created_at`;

// Build product details SELECT clause
export const buildProductSelectClause = () => `
  SELECT 
    p.*,
    c.slug as category_slug,
    c.name as category_name,
    c.icon as category_icon,
    
    -- Product images
    COALESCE(
      json_agg(
        jsonb_build_object(
          'url', pi.image_url,
          'alt_text', pi.alt_text,
          'is_primary', pi.is_primary,
          'sort_order', pi.sort_order
        )
      ) FILTER (WHERE pi.id IS NOT NULL),
      '[]'
    ) as images,
    
    -- Allergens
    COALESCE(
      json_agg(
        jsonb_build_object(
          'code', pa.allergen_code,
          'name', pa.allergen_name
        )
      ) FILTER (WHERE pa.id IS NOT NULL),
      '[]'
    ) as allergens,
    
    -- Portion pricing
    COALESCE(
      json_agg(
        jsonb_build_object(
          'name', pp.size_label,
          'persons', pp.persons,
          'discount_percentage', pp.discount_percentage,
          'final_price', p.base_price * (1 - pp.discount_percentage / 100)
        )
      ) FILTER (WHERE pp.id IS NOT NULL),
      '[]'
    ) as portion_pricing,
    
    -- Recent reviews (simplified - no customers table)
    '[]' as reviews`;

// Build product details FROM clause
export const buildProductFromClause = () => `
  FROM products p
  JOIN categories c ON p.category_id = c.id
  LEFT JOIN product_images pi ON p.id = pi.product_id
  LEFT JOIN product_allergens pa ON p.id = pa.product_id
  LEFT JOIN portion_pricing pp ON p.id = pp.product_id`;

// Build product details GROUP BY clause
export const buildProductGroupByClause = () => `
  GROUP BY p.id, p.name, p.description, p.prep_time_minutes,
           c.slug, c.name, c.icon`;
