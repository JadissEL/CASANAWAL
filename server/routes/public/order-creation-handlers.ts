// =====================================================
// ORDER CREATION HANDLERS - REFACTORED FROM ORDERS.TS (≤150 lines)
// =====================================================

import { RequestHandler } from "express";
import { db } from "../../database/connection";
import { createOrGetClient, calculateOrderTotals, createOrderRecord, createOrderItems } from './order-creation-utils.js';

// Create a new order
export const createOrder: RequestHandler = async (req, res) => {
  try {
    const {
      items,
      client_info,
      delivery_info,
      payment_info,
      promo_code,
      notes
    } = req.body;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Order items are required'
      });
    }

    if (!client_info?.phone || !delivery_info?.address || !delivery_info?.date || !delivery_info?.slot) {
      return res.status(400).json({
        success: false,
        error: 'Client info and delivery details are required'
      });
    }

    // Start transaction
    await db.query('BEGIN');

    try {
      // Create or get client
      const clientId = await createOrGetClient(client_info, delivery_info);
      
      // Calculate order totals and validate items
      const { subtotal, validatedItems, totalAmount, depositRequired } = await calculateOrderTotals(items, promo_code);
      
      // Calculate delivery fee
      const deliveryFee = calculateDeliveryFee(delivery_info.zone, subtotal);
      
      // Create the order
      const order = await createOrderRecord({
        clientId,
        subtotal,
        deliveryFee,
        totalAmount,
        depositRequired,
        delivery_info,
        payment_info,
        promo_code,
        notes
      });

      // Create order items
      await createOrderItems(order.id, validatedItems);
      
      // Commit transaction
      await db.query('COMMIT');

      // Return complete order details
      res.status(201).json({
        success: true,
        data: {
          order: {
            id: order.id,
            reference: order.reference,
            status: order.status,
            subtotal: order.subtotal,
            delivery_fee: order.delivery_fee,
            total_amount: order.total_amount,
            deposit_required: order.deposit_required,
            delivery_date: order.delivery_date,
            delivery_slot: order.delivery_slot,
            delivery_address: order.delivery_address,
            notes: order.notes,
            created_at: order.created_at,
            items: validatedItems
          },
          payment_info: {
            deposit_amount: depositRequired,
            total_amount: totalAmount,
            payment_methods: ['bank_transfer', 'cash_deposit', 'card']
          }
        }
      });

    } catch (error) {
      await db.query('ROLLBACK');
      throw error;
    }

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create order'
    });
  }
};

// Helper functions imported from order-creation-utils.ts to keep file ≤150 lines

// Utility function for delivery fee calculation
const calculateDeliveryFee = (zone: string, subtotal: number): number => {
  const feeStructure: { [key: string]: number } = {
    'centre-ville': 10,
    'quartier-admin': 15,
    'zone-industrielle': 20,
    'peripherie': 25
  };
  
  // Free delivery threshold
  if (subtotal >= 200) return 0;
  
  return feeStructure[zone] || 15;
};
