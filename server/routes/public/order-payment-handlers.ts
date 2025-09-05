// =====================================================
// ORDER PAYMENT HANDLERS - REFACTORED FROM ORDERS.TS (≤150 lines)
// =====================================================

import { RequestHandler } from "express";
import { db } from "../../database/connection";
import bcrypt from 'bcryptjs';

// Submit payment
export const submitPayment: RequestHandler = async (req, res) => {
  try {
    const { order_reference, payment_method, amount, transaction_details } = req.body;

    if (!order_reference || !payment_method || !amount) {
      return res.status(400).json({
        success: false,
        error: 'Order reference, payment method, and amount are required'
      });
    }

    // Get order details
    const orderResult = await db.query(
      'SELECT * FROM orders WHERE reference = $1',
      [order_reference]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    const order = orderResult.rows[0];

    // Check if order can receive payments
    if (!['pending_payment', 'partially_paid'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        error: 'Order cannot receive payments in its current status'
      });
    }

    // Validate payment amount
    const totalPaid = await getTotalPaidAmount(order.id);
    const remainingAmount = parseFloat(order.total_amount) - totalPaid;

    if (parseFloat(amount) > remainingAmount) {
      return res.status(400).json({
        success: false,
        error: `Payment amount exceeds remaining balance. Remaining: ${remainingAmount} MAD`
      });
    }

    // Create payment record
    const paymentResult = await db.query(`
      INSERT INTO payments (
        order_id, method, amount, status, transaction_id, 
        transaction_details, verification_code, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      RETURNING *
    `, [
      order.id,
      payment_method,
      amount,
      'pending_verification',
      transaction_details?.transaction_id || null,
      JSON.stringify(transaction_details || {}),
      await generateVerificationCode()
    ]);

    const payment = paymentResult.rows[0];

    // Update order status based on payment
    const newTotalPaid = totalPaid + parseFloat(amount);
    let newOrderStatus = order.status;

    if (newTotalPaid >= parseFloat(order.total_amount)) {
      newOrderStatus = 'paid';
    } else if (newTotalPaid >= parseFloat(order.deposit_required)) {
      newOrderStatus = 'confirmed';
    } else {
      newOrderStatus = 'partially_paid';
    }

    await db.query(
      'UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2',
      [newOrderStatus, order.id]
    );

    res.json({
      success: true,
      data: {
        payment: {
          id: payment.id,
          amount: parseFloat(payment.amount),
          method: payment.method,
          status: payment.status,
          verification_code: payment.verification_code,
          created_at: payment.created_at
        },
        order_status: newOrderStatus,
        total_paid: newTotalPaid,
        remaining_amount: parseFloat(order.total_amount) - newTotalPaid
      }
    });

  } catch (error) {
    console.error('Submit payment error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit payment'
    });
  }
};

// Helper function to get total paid amount
const getTotalPaidAmount = async (orderId: string): Promise<number> => {
  const result = await db.query(`
    SELECT COALESCE(SUM(amount), 0) as total_paid 
    FROM payments 
    WHERE order_id = $1 AND status = 'verified'
  `, [orderId]);

  return parseFloat(result.rows[0].total_paid);
};

// Helper function to generate verification code
const generateVerificationCode = async (): Promise<string> => {
  const code = Math.random().toString(36).substr(2, 8).toUpperCase();
  const hashedCode = await bcrypt.hash(code, 10);
  return hashedCode;
};

// Verify payment (for admin use)
export const verifyPayment = async (paymentId: string, isVerified: boolean): Promise<boolean> => {
  try {
    await db.query(`
      UPDATE payments 
      SET status = $1, verified_at = $2
      WHERE id = $3
    `, [
      isVerified ? 'verified' : 'rejected',
      isVerified ? new Date() : null,
      paymentId
    ]);

    return true;
  } catch (error) {
    console.error('Verify payment error:', error);
    return false;
  }
};
