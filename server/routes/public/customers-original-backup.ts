// =====================================================
// CUSTOMERS ORIGINAL BACKUP - REFACTORED TO ≤150 LINES (PROMPT.MD PHASE 1)
// Simplified customer handlers consolidated into single file
// =====================================================

import { RequestHandler } from "express";
import { db } from "../../database/connection";

// Get customer profile (simplified)
export const getCustomerProfileSimple: RequestHandler = async (req, res) => {
  try {
    const { phone } = req.params;
    const customerResult = await db.query('SELECT c.*, ca.segment FROM clients c LEFT JOIN customer_analytics ca ON c.id = ca.client_id WHERE c.phone = $1', [phone]);
    if (customerResult.rows.length === 0) return res.status(404).json({ success: false, error: 'Customer not found' });

    const customer = customerResult.rows[0];
    const ordersResult = await db.query('SELECT reference, status, total_amount FROM orders WHERE client_id = $1 ORDER BY id DESC LIMIT 3', [customer.id]);

    res.json({
      success: true,
      data: {
        profile: { id: customer.id, phone: customer.phone, email: customer.email, first_name: customer.first_name, last_name: customer.last_name, total_orders: customer.total_orders, total_spent: customer.total_spent },
        recent_orders: ordersResult.rows
      }
    });
  } catch (error) {
    console.error('Get customer profile error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch customer profile' });
  }
};

// Update customer profile (simplified)
export const updateCustomerProfileSimple: RequestHandler = async (req, res) => {
  try {
    const { phone } = req.params;
    const { email, first_name, last_name, default_address } = req.body;
    const updatedCustomer = await db.query('UPDATE clients SET email = COALESCE($2, email), first_name = COALESCE($3, first_name), last_name = COALESCE($4, last_name), default_address = COALESCE($5, default_address) WHERE phone = $1 RETURNING *', [phone, email, first_name, last_name, default_address]);
    if (updatedCustomer.rows.length === 0) return res.status(404).json({ success: false, error: 'Customer not found' });
    res.json({ success: true, data: { customer: updatedCustomer.rows[0], message: 'Profile updated successfully' } });
  } catch (error) {
    console.error('Update customer profile error:', error);
    res.status(500).json({ success: false, error: 'Failed to update customer profile' });
  }
};

// Add customer review (simplified)
export const addCustomerReviewSimple: RequestHandler = async (req, res) => {
  try {
    const { phone } = req.params;
    const { product_id, rating, comment } = req.body;
    if (!product_id || !rating || rating < 1 || rating > 5) return res.status(400).json({ success: false, error: 'Valid product ID and rating (1-5) required' });

    const customerResult = await db.query('SELECT id FROM clients WHERE phone = $1', [phone]);
    if (customerResult.rows.length === 0) return res.status(404).json({ success: false, error: 'Customer not found' });

    const customerId = customerResult.rows[0].id;
    const existingReview = await db.query('SELECT id FROM reviews WHERE client_id = $1 AND product_id = $2', [customerId, product_id]);

    if (existingReview.rows.length > 0) {
      await db.query('UPDATE reviews SET rating = $1, comment = $2 WHERE id = $3', [rating, comment, existingReview.rows[0].id]);
      res.json({ success: true, data: { message: 'Review updated successfully' } });
    } else {
      await db.query('INSERT INTO reviews (product_id, client_id, rating, comment, status) VALUES ($1, $2, $3, $4, $5)', [product_id, customerId, rating, comment, 'pending']);
      res.status(201).json({ success: true, data: { message: 'Review submitted successfully' } });
    }
  } catch (error) {
    console.error('Add customer review error:', error);
    res.status(500).json({ success: false, error: 'Failed to submit review' });
  }
};

// Get customer recommendations (simplified)
export const getCustomerRecommendationsSimple: RequestHandler = async (req, res) => {
  try {
    const { phone } = req.params;
    const { limit = '6' } = req.query;
    const customerResult = await db.query('SELECT id FROM clients WHERE phone = $1', [phone]);
    if (customerResult.rows.length === 0) return res.status(404).json({ success: false, error: 'Customer not found' });

    const recommendationsResult = await db.query('SELECT p.id, p.name, p.base_price, p.rating, (SELECT pi.image_url FROM product_images pi WHERE pi.product_id = p.id AND pi.is_primary = true LIMIT 1) as main_image FROM products p WHERE p.is_active = true ORDER BY p.rating DESC, p.is_featured DESC LIMIT $1', [parseInt(limit as string)]);
    res.json({ success: true, data: { recommendations: recommendationsResult.rows, strategies_used: ['popular'] } });
  } catch (error) {
    console.error('Get customer recommendations error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch recommendations' });
  }
};

// Get customer loyalty status (simplified)
export const getCustomerLoyaltySimple: RequestHandler = async (req, res) => {
  try {
    const { phone } = req.params;
    const loyaltyResult = await db.query('SELECT total_orders, total_spent, FLOOR(total_spent / 10) as loyalty_points, CASE WHEN total_spent >= 5000 THEN \'platinum\' WHEN total_spent >= 2000 THEN \'gold\' WHEN total_spent >= 500 THEN \'silver\' ELSE \'bronze\' END as loyalty_tier FROM clients WHERE phone = $1', [phone]);
    if (loyaltyResult.rows.length === 0) return res.status(404).json({ success: false, error: 'Customer not found' });

    const loyalty = loyaltyResult.rows[0];
    const discount = loyalty.loyalty_tier === 'platinum' ? 20 : loyalty.loyalty_tier === 'gold' ? 15 : loyalty.loyalty_tier === 'silver' ? 10 : 5;
    res.json({ success: true, data: { loyalty_info: { points: loyalty.loyalty_points, tier: loyalty.loyalty_tier, total_spent: loyalty.total_spent }, benefits: { discount } } });
  } catch (error) {
    console.error('Get customer loyalty error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch loyalty information' });
  }
};

// Backward compatibility exports
export { getCustomerProfileSimple as getCustomerProfile, updateCustomerProfileSimple as updateCustomerProfile, addCustomerReviewSimple as addCustomerReview, getCustomerRecommendationsSimple as getCustomerRecommendations, getCustomerLoyaltySimple as getCustomerLoyalty };
