// =====================================================
// ADMIN PRODUCT HANDLERS - REFACTORED FROM SIMPLE-ALL.TS (≤150 lines)
// =====================================================

import { RequestHandler } from "express";
import { db } from "../../database/connection";
import { ProductUpdateData } from './admin-types.js';

// GET ALL PRODUCTS
export const getAllProducts: RequestHandler = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.sort_order ASC, p.name ASC
    `);
    
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Erreur récupération produits:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
};

// GET PRODUCT BY ID
export const getProductById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.query(`
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Produit non trouvé' });
    }
    
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Erreur récupération produit:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
};

// CREATE PRODUCT
export const createProduct: RequestHandler = async (req, res) => {
  try {
    const productData = req.body;
    
    const result = await db.query(`
      INSERT INTO products (
        sku, name, description, base_price, category_id, 
        is_active, is_vegetarian, is_spicy, prep_time_minutes,
        main_image, rating, is_featured, sort_order
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `, [
      productData.sku,
      productData.name,
      productData.description,
      productData.base_price,
      productData.category_id,
      productData.is_active,
      productData.is_vegetarian,
      productData.is_spicy,
      productData.prep_time_minutes,
      productData.main_image,
      productData.rating,
      productData.is_featured,
      productData.sort_order
    ]);
    
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Erreur création produit:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
};

// DELETE PRODUCT
export const deleteProduct: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Produit non trouvé' });
    }
    
    res.json({ success: true, message: 'Produit supprimé' });
  } catch (error) {
    console.error('Erreur suppression produit:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
};

// TOGGLE PRODUCT STATUS
export const toggleProductStatus: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.query(
      'UPDATE products SET is_active = NOT is_active WHERE id = $1 RETURNING *',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Produit non trouvé' });
    }
    
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Erreur toggle statut produit:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
};

// Alias for getAllProducts
export const getProducts = getAllProducts;
