// =====================================================
// ORDER CANCELLATION HANDLERS - REFACTORED FROM ORDERS.TS (≤150 lines)
// =====================================================

import { RequestHandler } from "express";
import { db } from "../../database/connection";

// Cancel order
export const cancelOrder: RequestHandler = async (req, res) => {
  try {
    const { reference } = req.params;
    const { reason, refund_method } = req.body;

    // Get order details
    const orderResult = await db.query(
      'SELECT * FROM orders WHERE reference = $1',
      [reference]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    const order = orderResult.rows[0];

    // Check if order can be cancelled
    if (['delivered', 'cancelled', 'refunded'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        error: 'Order cannot be cancelled in its current status'
      });
    }

    // Check cancellation deadline (24 hours before delivery)
    const deliveryDateTime = new Date(`${order.delivery_date}T${order.delivery_slot.split(' - ')[0]}:00`);
    const now = new Date();
    const hoursUntilDelivery = (deliveryDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursUntilDelivery < 24) {
      return res.status(400).json({
        success: false,
        error: 'Orders cannot be cancelled less than 24 hours before delivery'
      });
    }

    await db.query('BEGIN');

    try {
      // Update order status
      await db.query(`
        UPDATE orders 
        SET status = 'cancelled', 
            cancellation_reason = $1,
            cancelled_at = NOW(),
            updated_at = NOW()
        WHERE id = $2
      `, [reason, order.id]);

      // Get total paid amount
      const paymentsResult = await db.query(`
        SELECT COALESCE(SUM(amount), 0) as total_paid 
        FROM payments 
        WHERE order_id = $1 AND status = 'verified'
      `, [order.id]);

      const totalPaid = parseFloat(paymentsResult.rows[0].total_paid);

      // Process refund if payment was made
      let refundInfo = null;
      if (totalPaid > 0) {
        const refundReference = `REF-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
        await db.query(`
          INSERT INTO refunds (order_id, reference, amount, method, status, processing_fee, net_refund_amount, created_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
        `, [order.id, refundReference, totalPaid, refund_method || 'bank_transfer', 'processing', totalPaid * 0.05, totalPaid * 0.95]);
        
        refundInfo = {
          reference: refundReference,
          amount: totalPaid,
          processing_fee: totalPaid * 0.05,
          net_amount: totalPaid * 0.95,
          method: refund_method || 'bank_transfer',
          status: 'processing'
        };
      }

      // Update inventory (restore product quantities)
      const itemsResult = await db.query('SELECT product_id, quantity FROM order_items WHERE order_id = $1', [order.id]);
      for (const item of itemsResult.rows) {
        await db.query('UPDATE products SET stock_quantity = stock_quantity + $1 WHERE id = $2', [item.quantity, item.product_id]);
      }

      await db.query('COMMIT');

      res.json({
        success: true,
        data: {
          order_reference: order.reference,
          status: 'cancelled',
          cancelled_at: new Date().toISOString(),
          refund_info: refundInfo
        }
      });

    } catch (error) {
      await db.query('ROLLBACK');
      throw error;
    }

  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to cancel order'
    });
  }
};

// Helper functions moved to order-cancellation-utils.ts to keep file ≤150 lines

// Get cancellation policy
export const getCancellationPolicy: RequestHandler = async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        policy: {
          cancellation_deadline: '24 hours before delivery',
          refund_processing_fee: '5%',
          refund_methods: ['bank_transfer', 'store_credit'],
          processing_time: {
            bank_transfer: '3-5 business days',
            store_credit: '1-2 business days'
          },
          restrictions: [
            'Orders cannot be cancelled less than 24 hours before delivery',
            'Custom orders may have different cancellation terms',
            'Refunds are subject to a 5% processing fee'
          ]
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch cancellation policy'
    });
  }
};
