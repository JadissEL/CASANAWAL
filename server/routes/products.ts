import { RequestHandler } from "express";
import { db } from "../database/connection";
import { z } from "zod";

// Validation schemas
const ProductCreateSchema = z.object({
  category_id: z.string().uuid(),
  sku: z.string().min(1).max(100),
  base_price: z.number().positive(),
  prep_time_minutes: z.number().min(0),
  description: z.string().optional(),
  ingredients: z.array(z.string()).optional(),
  allergens: z.array(z.string()).optional(),
  nutrition_info: z.record(z.any()).optional(),
  images: z.array(z.string()).optional(),
  is_active: z.boolean().default(true)
});

// Common product SELECT clause to avoid duplication
const PRODUCT_SELECT = `
  SELECT
    p.id,
    p.sku,
    p.base_price,
    p.is_active,
    p.is_vegetarian,
    p.is_spicy,
    p.is_featured,
    p.prep_time_minutes,
    p.rating,
    p.rating_count,
    p.sort_order,
    p.sku as name,
    '' as description,
    COALESCE(c.name, c.slug) as category_name,
    c.slug as category_slug
  FROM products p
  LEFT JOIN categories c ON p.category_id = c.id`;

// Error response helper
const createErrorResponse = (error: any, message: string, statusCode = 500) => ({
  success: false,
  error: message,
  ...(process.env.NODE_ENV === 'development' && { details: error.message })
});

// Get all products - Optimized
export const getProducts: RequestHandler = async (req, res) => {
  try {
    const { category_id, active_only = 'true', search, page = '1', limit = '20' } = req.query;

    let query = `${PRODUCT_SELECT} WHERE 1=1`;
    const params: any[] = [];
    let paramIndex = 1;

    // Build WHERE conditions efficiently
    if (category_id) {
      query += ` AND p.category_id = $${paramIndex}`;
      params.push(category_id);
      paramIndex++;
    }

    if (active_only === 'true') {
      query += ` AND p.is_active = true`;
    }

    if (search) {
      query += ` AND p.sku ILIKE $${paramIndex}`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    // Add pagination
    const limitNum = parseInt(limit as string);
    const offsetNum = (parseInt(page as string) - 1) * limitNum;

    query += ` ORDER BY p.sort_order ASC, p.id DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limitNum, offsetNum);

    const result = await db.query(query, params);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json(createErrorResponse(error, 'Failed to fetch products'));
  }
};

// Get single product by ID - Optimized
export const getProduct: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(`${PRODUCT_SELECT} WHERE p.id = $1`, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json(createErrorResponse(error, 'Failed to fetch product'));
  }
};