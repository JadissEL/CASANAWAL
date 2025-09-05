// =====================================================
// PROMO HANDLERS - REFACTORED FROM BACKUP (≤150 lines)
// =====================================================

import { RequestHandler } from "express";
import { db } from "../../database/connection";

// Validate promo code
export const validatePromoCode: RequestHandler = async (req, res) => {
  try {
    const { code, order_total, customer_phone } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        error: 'Promo code is required'
      });
    }

    // Get promo code details
    const promoResult = await db.query(`
      SELECT *
      FROM promo_codes 
      WHERE UPPER(code) = UPPER($1)
        AND is_active = true 
        AND valid_from <= CURRENT_DATE 
        AND valid_until >= CURRENT_DATE
    `, [code]);

    if (promoResult.rows.length === 0) {
      return res.json({
        success: false,
        valid: false,
        message: 'Code promo invalide ou expiré'
      });
    }

    const promo = promoResult.rows[0];

    // Check usage limit
    if (promo.usage_limit && promo.used_count >= promo.usage_limit) {
      return res.json({
        success: false,
        valid: false,
        message: 'Ce code promo a atteint sa limite d\'utilisation'
      });
    }

    // Check minimum order amount
    if (promo.min_order_amount && order_total < promo.min_order_amount) {
      return res.json({
        success: false,
        valid: false,
        message: `Commande minimum de ${promo.min_order_amount} MAD requise pour ce code promo`
      });
    }

    // Check if customer has already used this code
    if (customer_phone) {
      const customerUsage = await db.query(`
        SELECT COUNT(*) as usage_count
        FROM orders o
        WHERE o.metadata->>'client_phone' = $1
          AND o.metadata->>'promo_code' = $2
          AND o.status != 'cancelled'
      `, [customer_phone, code]);

      if (parseInt(customerUsage.rows[0].usage_count) > 0) {
        return res.json({
          success: false,
          valid: false,
          message: 'Vous avez déjà utilisé ce code promo'
        });
      }
    }

    // Calculate discount
    let discountAmount = 0;
    let discountDescription = '';

    switch (promo.type) {
      case 'percentage':
        discountAmount = order_total * (promo.value / 100);
        discountDescription = `${promo.value}% de réduction`;
        break;
      case 'fixed_amount':
        discountAmount = Math.min(promo.value, order_total);
        discountDescription = `${promo.value} MAD de réduction`;
        break;
      case 'free_delivery':
        discountAmount = 0; // Will be applied to delivery fee
        discountDescription = 'Livraison gratuite';
        break;
    }

    res.json({
      success: true,
      valid: true,
      promo_code: {
        id: promo.id,
        code: promo.code,
        name_fr: promo.name_fr,
        type: promo.type,
        value: promo.value,
        discount_amount: discountAmount,
        description: discountDescription,
        valid_until: promo.valid_until,
        remaining_uses: promo.usage_limit ? promo.usage_limit - promo.used_count : null
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

// Helper function to calculate promo discount
export const calculatePromoDiscount = (promoType: string, promoValue: number, orderTotal: number): number => {
  switch (promoType) {
    case 'percentage':
      return orderTotal * (promoValue / 100);
    case 'fixed_amount':
      return Math.min(promoValue, orderTotal);
    case 'free_delivery':
      return 0;
    default:
      return 0;
  }
};
