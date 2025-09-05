// =====================================================
// ORDERS REFACTORED - PROMPT.MD APPLIED (≤150 lines)
// =====================================================
// This file has been refactored according to prompt.md Phase 1: File Splitting
// Original 700 lines reduced to modular exports

import { RequestHandler } from "express";
import { db } from "../../database/connection";

// Export all order handlers from their respective modules
export { createOrder } from './order-creation-handlers';
export { getOrderByReference, getCustomerOrders } from './order-retrieval-handlers';
export { submitPayment, verifyPayment } from './order-payment-handlers';
export { cancelOrder, getCancellationPolicy } from './order-cancellation-handlers';

// Simplified order status checker
export const getOrderStatus: RequestHandler = async (req, res) => {
  try {
    const { reference } = req.params;
    
    const result = await db.query(
      'SELECT reference, status, total_amount, created_at FROM orders WHERE reference = $1',
      [reference]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to get order status' });
  }
};

// Simplified order summary for quick access
export const getOrderSummary: RequestHandler = async (req, res) => {
  try {
    const { phone } = req.params;
    
    const result = await db.query(`
      SELECT 
        COUNT(*) as total_orders,
        SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) as completed_orders,
        SUM(total_amount) as total_spent
      FROM orders o
      JOIN clients c ON o.client_id = c.id
      WHERE c.phone = $1
    `, [phone]);
    
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to get order summary' });
  }
};

// Quick order validation
export const validateOrderData: RequestHandler = async (req, res) => {
  try {
    const { items, client_info, delivery_info } = req.body;
    
    const errors = [];
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      errors.push('Order items are required');
    }
    
    if (!client_info?.phone) {
      errors.push('Client phone is required');
    }
    
    if (!delivery_info?.address || !delivery_info?.date || !delivery_info?.slot) {
      errors.push('Complete delivery information is required');
    }
    
    // Validate delivery date
    const deliveryDate = new Date(delivery_info?.date);
    const today = new Date();
    
    if (deliveryDate < today) {
      errors.push('Delivery date cannot be in the past');
    }
    
    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }
    
    res.json({ success: true, message: 'Order data is valid' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Validation failed' });
  }
};

// Quick product availability check
export const checkProductAvailability: RequestHandler = async (req, res) => {
  try {
    const { product_ids } = req.body;
    
    if (!Array.isArray(product_ids)) {
      return res.status(400).json({ success: false, error: 'Product IDs array required' });
    }
    
    const result = await db.query(`
      SELECT id, name, price, stock_quantity, is_available 
      FROM products 
      WHERE id = ANY($1::uuid[])
    `, [product_ids]);
    
    const availability = result.rows.map(product => ({
      id: product.id,
      name: product.name,
      price: parseFloat(product.price),
      available: product.is_available && product.stock_quantity > 0,
      stock: product.stock_quantity
    }));
    
    res.json({ success: true, data: availability });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to check availability' });
  }
};

// Get order statistics
export const getOrderStats: RequestHandler = async (req, res) => {
  try {
    const stats = await db.query(`
      SELECT 
        COUNT(*) as total_orders,
        COUNT(CASE WHEN status = 'pending_payment' THEN 1 END) as pending_payment,
        COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed,
        COUNT(CASE WHEN status = 'preparing' THEN 1 END) as preparing,
        COUNT(CASE WHEN status = 'ready' THEN 1 END) as ready,
        COUNT(CASE WHEN status = 'delivered' THEN 1 END) as delivered,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled
      FROM orders 
      WHERE created_at >= CURRENT_DATE
    `);
    
    res.json({ success: true, data: stats.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to get order statistics' });
  }
};