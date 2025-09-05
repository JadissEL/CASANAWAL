// =====================================================
// PROMO CODE UTILITIES (≤150 lines)
// =====================================================

import { db } from "../../database/connection";

// Helper function to apply promo code (for internal use)
export const applyPromoCode = async (
  promoCode: string, 
  orderAmount: number, 
  customerId?: string, 
  zone?: string
): Promise<{
  success: boolean;
  discountAmount: number;
  finalAmount: number;
  error?: string;
}> => {
  try {
    const result = await db.query(`
      SELECT * FROM promo_codes 
      WHERE code = $1 AND is_active = true
    `, [promoCode.toUpperCase()]);

    if (result.rows.length === 0) {
      return { success: false, discountAmount: 0, finalAmount: orderAmount, error: 'Invalid promo code' };
    }

    const promo = result.rows[0];
    
    // Apply validation logic (simplified for brevity)
    let discountAmount = 0;
    if (promo.discount_type === 'percentage') {
      discountAmount = (orderAmount * promo.discount_value) / 100;
      if (promo.maximum_discount_amount && discountAmount > promo.maximum_discount_amount) {
        discountAmount = promo.maximum_discount_amount;
      }
    } else {
      discountAmount = promo.discount_value;
    }

    discountAmount = Math.min(discountAmount, orderAmount);
    
    return {
      success: true,
      discountAmount: parseFloat(discountAmount.toFixed(2)),
      finalAmount: parseFloat((orderAmount - discountAmount).toFixed(2))
    };
  } catch (error) {
    return { 
      success: false, 
      discountAmount: 0, 
      finalAmount: orderAmount, 
      error: 'Validation failed' 
    };
  }
};

// Helper function to check promo code validity
export const isPromoCodeValid = async (promoCode: string): Promise<boolean> => {
  try {
    const result = await db.query(`
      SELECT * FROM promo_codes 
      WHERE code = $1 AND is_active = true
      AND valid_from <= NOW() AND valid_until >= NOW()
    `, [promoCode.toUpperCase()]);

    return result.rows.length > 0;
  } catch (error) {
    return false;
  }
};

// Helper function to get promo code details
export const getPromoCodeDetails = async (promoCode: string) => {
  try {
    const result = await db.query(`
      SELECT * FROM promo_codes 
      WHERE code = $1 AND is_active = true
    `, [promoCode.toUpperCase()]);

    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    return null;
  }
};

// Helper function to increment promo code usage
export const incrementPromoUsage = async (promoCode: string): Promise<boolean> => {
  try {
    await db.query(`
      UPDATE promo_codes 
      SET usage_count = usage_count + 1
      WHERE code = $1
    `, [promoCode.toUpperCase()]);

    return true;
  } catch (error) {
    console.error('Error incrementing promo usage:', error);
    return false;
  }
};

// Helper function to check if customer can use promo (first-time restriction)
export const canCustomerUsePromo = async (customerId: string, promoCode: string): Promise<boolean> => {
  try {
    const promo = await getPromoCodeDetails(promoCode);
    if (!promo) return false;

    if (promo.first_time_only) {
      const orderHistory = await db.query(`
        SELECT COUNT(*) as order_count 
        FROM orders 
        WHERE customer_id = $1 AND status NOT IN ('cancelled')
      `, [customerId]);

      return parseInt(orderHistory.rows[0].order_count) === 0;
    }

    return true;
  } catch (error) {
    return false;
  }
};

// Helper function to calculate discount amount
export const calculateDiscount = (
  discountType: 'percentage' | 'fixed_amount',
  discountValue: number,
  orderAmount: number,
  maxDiscount?: number
): number => {
  let discountAmount = 0;

  if (discountType === 'percentage') {
    discountAmount = (orderAmount * discountValue) / 100;
    if (maxDiscount && discountAmount > maxDiscount) {
      discountAmount = maxDiscount;
    }
  } else {
    discountAmount = discountValue;
  }

  return Math.min(discountAmount, orderAmount);
};
