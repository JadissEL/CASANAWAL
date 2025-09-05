// =====================================================
// PROMO CODE HANDLERS (≤150 lines)
// =====================================================

import { RequestHandler } from "express";
import { db } from "../../database/connection";

interface PromoCode {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed_amount';
  discount_value: number;
  minimum_order_amount?: number;
  maximum_discount_amount?: number;
  usage_limit?: number;
  usage_count: number;
  valid_from: Date;
  valid_until: Date;
  is_active: boolean;
  applicable_zones?: string[];
  first_time_only?: boolean;
}

// Validate promo code
export const validatePromoCode: RequestHandler = async (req, res) => {
  try {
    const { code, order_amount, zone, customer_id } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        error: 'Promo code is required'
      });
    }

    if (!order_amount || order_amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Valid order amount is required'
      });
    }

    // Get promo code from database
    const promoResult = await db.query(`
      SELECT * FROM promo_codes 
      WHERE code = $1 AND is_active = true
    `, [code.toUpperCase()]);

    if (promoResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Invalid or expired promo code'
      });
    }

    const promo: PromoCode = promoResult.rows[0];
    const now = new Date();

    // Check validity period
    if (now < new Date(promo.valid_from) || now > new Date(promo.valid_until)) {
      return res.status(400).json({
        success: false,
        error: 'Promo code has expired'
      });
    }

    // Check usage limit
    if (promo.usage_limit && promo.usage_count >= promo.usage_limit) {
      return res.status(400).json({
        success: false,
        error: 'Promo code usage limit exceeded'
      });
    }

    // Check minimum order amount
    if (promo.minimum_order_amount && order_amount < promo.minimum_order_amount) {
      return res.status(400).json({
        success: false,
        error: `Minimum order amount of ${promo.minimum_order_amount} MAD required`
      });
    }

    // Check applicable zones
    if (promo.applicable_zones && promo.applicable_zones.length > 0 && zone) {
      if (!promo.applicable_zones.includes(zone)) {
        return res.status(400).json({
          success: false,
          error: 'Promo code not applicable for this delivery zone'
        });
      }
    }

    // Check first-time customer restriction
    if (promo.first_time_only && customer_id) {
      const orderHistory = await db.query(`
        SELECT COUNT(*) as order_count 
        FROM orders 
        WHERE customer_id = $1 AND status NOT IN ('cancelled')
      `, [customer_id]);

      if (parseInt(orderHistory.rows[0].order_count) > 0) {
        return res.status(400).json({
          success: false,
          error: 'This promo code is only valid for first-time customers'
        });
      }
    }

    // Calculate discount
    let discountAmount = 0;
    if (promo.discount_type === 'percentage') {
      discountAmount = (order_amount * promo.discount_value) / 100;
      
      // Apply maximum discount limit if specified
      if (promo.maximum_discount_amount && discountAmount > promo.maximum_discount_amount) {
        discountAmount = promo.maximum_discount_amount;
      }
    } else if (promo.discount_type === 'fixed_amount') {
      discountAmount = promo.discount_value;
    }

    // Ensure discount doesn't exceed order amount
    discountAmount = Math.min(discountAmount, order_amount);

    const finalAmount = order_amount - discountAmount;

    res.json({
      success: true,
      data: {
        promo_code: promo.code,
        discount_type: promo.discount_type,
        discount_value: promo.discount_value,
        discount_amount: parseFloat(discountAmount.toFixed(2)),
        original_amount: parseFloat(order_amount.toFixed(2)),
        final_amount: parseFloat(finalAmount.toFixed(2)),
        savings: parseFloat(discountAmount.toFixed(2)),
        valid_until: promo.valid_until,
        terms: {
          minimum_order: promo.minimum_order_amount,
          maximum_discount: promo.maximum_discount_amount,
          applicable_zones: promo.applicable_zones,
          first_time_only: promo.first_time_only
        }
      }
    });

  } catch (error) {
    console.error('Validate promo code error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to validate promo code'
    });
  }
};

// Utility function moved to promo-utils.ts to keep file under 150 lines
