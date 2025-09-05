// =====================================================
// CUSTOMER LOYALTY HANDLERS - REFACTORED FROM CUSTOMERS.TS (≤150 lines)
// =====================================================

import { RequestHandler } from "express";
import { db } from "../../database/connection";

// Get customer loyalty status
export const getCustomerLoyalty: RequestHandler = async (req, res) => {
  try {
    const { phone } = req.params;

    const loyaltyResult = await db.query(`
      SELECT 
        c.total_orders,
        c.total_spent,
        ca.segment,
        ca.lifetime_value,
        ca.satisfaction_score,
        
        -- Calculate loyalty points (1 point per 10 MAD spent)
        FLOOR(c.total_spent / 10) as loyalty_points,
        
        -- Calculate tier based on total spent
        CASE 
          WHEN c.total_spent >= 5000 THEN 'platinum'
          WHEN c.total_spent >= 2000 THEN 'gold'
          WHEN c.total_spent >= 500 THEN 'silver'
          ELSE 'bronze'
        END as loyalty_tier,
        
        -- Calculate next tier requirements
        CASE 
          WHEN c.total_spent >= 5000 THEN 0
          WHEN c.total_spent >= 2000 THEN 5000 - c.total_spent
          WHEN c.total_spent >= 500 THEN 2000 - c.total_spent
          ELSE 500 - c.total_spent
        END as amount_to_next_tier,
        
        -- Benefits based on tier
        CASE 
          WHEN c.total_spent >= 5000 THEN 20  -- 20% discount
          WHEN c.total_spent >= 2000 THEN 15  -- 15% discount
          WHEN c.total_spent >= 500 THEN 10   -- 10% discount
          ELSE 5                              -- 5% discount
        END as discount_percentage
        
      FROM clients c
      LEFT JOIN customer_analytics ca ON c.id = ca.client_id
      WHERE c.phone = $1
    `, [phone]);

    if (loyaltyResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Customer not found'
      });
    }

    const loyalty = loyaltyResult.rows[0];

    // Get tier benefits
    const tierBenefits = {
      bronze: {
        discount: 5,
        free_delivery_threshold: 200,
        priority_support: false,
        exclusive_offers: false
      },
      silver: {
        discount: 10,
        free_delivery_threshold: 150,
        priority_support: false,
        exclusive_offers: true
      },
      gold: {
        discount: 15,
        free_delivery_threshold: 100,
        priority_support: true,
        exclusive_offers: true
      },
      platinum: {
        discount: 20,
        free_delivery_threshold: 0,
        priority_support: true,
        exclusive_offers: true
      }
    };

    res.json({
      success: true,
      data: {
        loyalty_info: {
          points: loyalty.loyalty_points,
          tier: loyalty.loyalty_tier,
          total_spent: loyalty.total_spent,
          total_orders: loyalty.total_orders,
          amount_to_next_tier: loyalty.amount_to_next_tier,
          satisfaction_score: loyalty.satisfaction_score
        },
        benefits: tierBenefits[loyalty.loyalty_tier as keyof typeof tierBenefits],
        tier_progression: {
          bronze: { min_spent: 0, benefits: tierBenefits.bronze },
          silver: { min_spent: 500, benefits: tierBenefits.silver },
          gold: { min_spent: 2000, benefits: tierBenefits.gold },
          platinum: { min_spent: 5000, benefits: tierBenefits.platinum }
        }
      }
    });

  } catch (error) {
    console.error('Get customer loyalty error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch loyalty information'
    });
  }
};
