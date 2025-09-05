// =====================================================
// CUSTOMER REVIEW HANDLERS - REFACTORED FROM CUSTOMERS.TS (≤150 lines)
// =====================================================

import { RequestHandler } from "express";
import { db } from "../../database/connection";

// Add customer review
export const addCustomerReview: RequestHandler = async (req, res) => {
  try {
    const { phone } = req.params;
    const { product_id, order_id, rating, comment } = req.body;

    // Validate input
    if (!product_id || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        error: 'Product ID and valid rating (1-5) are required'
      });
    }

    // Get customer
    const customerResult = await db.query(
      'SELECT id FROM clients WHERE phone = $1',
      [phone]
    );

    if (customerResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Customer not found'
      });
    }

    const customerId = customerResult.rows[0].id;

    // Check if customer has ordered this product
    let orderCheck = null;
    if (order_id) {
      orderCheck = await db.query(`
        SELECT o.id FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        WHERE o.client_id = $1 AND o.id = $2 AND oi.product_id = $3
      `, [customerId, order_id, product_id]);

      if (orderCheck.rows.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'You can only review products you have ordered'
        });
      }
    }

    // Check if review already exists
    const existingReview = await db.query(`
      SELECT id FROM reviews 
      WHERE client_id = $1 AND product_id = $2
    `, [customerId, product_id]);

    if (existingReview.rows.length > 0) {
      // Update existing review
      const updatedReview = await db.query(`
        UPDATE reviews 
        SET rating = $3, comment = $4, status = 'pending'
        WHERE id = $1
        RETURNING *
      `, [existingReview.rows[0].id, rating, comment]);

      res.json({
        success: true,
        data: {
          review: updatedReview.rows[0],
          message: 'Review updated successfully'
        }
      });
    } else {
      // Create new review
      const newReview = await db.query(`
        INSERT INTO reviews (product_id, client_id, order_id, rating, comment, status)
        VALUES ($1, $2, $3, $4, $5, 'pending')
        RETURNING *
      `, [product_id, customerId, order_id, rating, comment]);

      res.status(201).json({
        success: true,
        data: {
          review: newReview.rows[0],
          message: 'Review submitted successfully'
        }
      });
    }

    // Update product rating (recalculate)
    await db.query(`
      UPDATE products 
      SET 
        rating = (
          SELECT COALESCE(AVG(rating), 0) 
          FROM reviews 
          WHERE product_id = $1 AND status = 'approved'
        ),
        rating_count = (
          SELECT COUNT(*) 
          FROM reviews 
          WHERE product_id = $1 AND status = 'approved'
        )
      WHERE id = $1
    `, [product_id]);

  } catch (error) {
    console.error('Add customer review error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit review'
    });
  }
};
