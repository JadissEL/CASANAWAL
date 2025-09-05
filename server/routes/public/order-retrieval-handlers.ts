// =====================================================
// ORDER RETRIEVAL HANDLERS - REFACTORED FROM ORDERS.TS (≤150 lines)
// =====================================================

import { RequestHandler } from "express";
import { db } from "../../database/connection";

// Get order by reference
export const getOrderByReference: RequestHandler = async (req, res) => {
  try {
    const { reference } = req.params;

    // Get order details with client info
    const orderResult = await db.query(`
      SELECT 
        o.*,
        c.phone, c.email, c.first_name, c.last_name
      FROM orders o
      JOIN clients c ON o.client_id = c.id
      WHERE o.reference = $1
    `, [reference]);

    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    const order = orderResult.rows[0];

    // Get order items
    const itemsResult = await db.query(`
      SELECT 
        oi.*,
        p.name as current_product_name,
        p.price as current_price,
        p.is_available
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = $1
      ORDER BY oi.id
    `, [order.id]);

    // Get payments
    const paymentsResult = await db.query(`
      SELECT * FROM payments 
      WHERE order_id = $1 
      ORDER BY created_at DESC
    `, [order.id]);

    res.json({
      success: true,
      data: {
        order: {
          id: order.id,
          reference: order.reference,
          status: order.status,
          subtotal: parseFloat(order.subtotal),
          discount_amount: parseFloat(order.discount_amount || 0),
          delivery_fee: parseFloat(order.delivery_fee),
          total_amount: parseFloat(order.total_amount),
          deposit_required: parseFloat(order.deposit_required),
          delivery_date: order.delivery_date,
          delivery_slot: order.delivery_slot,
          delivery_address: order.delivery_address,
          payment_method: order.payment_method,
          notes: order.notes,
          metadata: order.metadata,
          created_at: order.created_at,
          updated_at: order.updated_at
        },
        client: {
          phone: order.phone,
          email: order.email,
          first_name: order.first_name,
          last_name: order.last_name
        },
        items: itemsResult.rows.map(item => ({
          id: item.id,
          product_id: item.product_id,
          product_name: item.product_name_snapshot,
          price: parseFloat(item.price_snapshot),
          quantity: item.quantity,
          total_price: parseFloat(item.total_price)
        })),
        payments: paymentsResult.rows.map(payment => ({
          id: payment.id,
          amount: parseFloat(payment.amount),
          method: payment.method,
          status: payment.status
        }))
      }
    });

  } catch (error) {
    console.error('Get order by reference error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch order details'
    });
  }
};

// Get customer order history
export const getCustomerOrders: RequestHandler = async (req, res) => {
  try {
    const { phone } = req.params;
    const { limit = '10', offset = '0' } = req.query;

    // Get customer orders
    const ordersResult = await db.query(`
      SELECT 
        o.id,
        o.reference,
        o.status,
        o.total_amount,
        o.delivery_date,
        o.delivery_slot,
        o.created_at,
        COUNT(oi.id) as item_count,
        COALESCE(SUM(p.amount), 0) as total_paid,
        array_agg(DISTINCT oi.product_name_snapshot) as item_names
      FROM orders o
      JOIN clients c ON o.client_id = c.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN payments p ON o.id = p.order_id AND p.status = 'verified'
      WHERE c.phone = $1
      GROUP BY o.id
      ORDER BY o.id DESC
      LIMIT $2 OFFSET $3
    `, [phone, parseInt(limit as string), parseInt(offset as string)]);

    // Get customer info
    const customerResult = await db.query(`
      SELECT phone, email, first_name, last_name, total_orders, total_spent
      FROM clients 
      WHERE phone = $1
    `, [phone]);

    if (customerResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Customer not found'
      });
    }

    res.json({
      success: true,
      data: {
        customer: customerResult.rows[0],
        orders: ordersResult.rows,
        pagination: {
          limit: parseInt(limit as string),
          offset: parseInt(offset as string),
          total: ordersResult.rows.length
        }
      }
    });

  } catch (error) {
    console.error('Get customer orders error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch customer orders'
    });
  }
};
