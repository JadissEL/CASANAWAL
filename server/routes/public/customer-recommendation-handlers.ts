// =====================================================
// CUSTOMER RECOMMENDATION HANDLERS - REFACTORED FROM CUSTOMERS.TS (≤150 lines)
// =====================================================

import { RequestHandler } from "express";
import { db } from "../../database/connection";
import { 
  getCustomerOrderHistory, 
  getCategoryRecommendations, 
  getCollaborativeRecommendations, 
  getPopularRecommendations 
} from './customer-recommendation-utils.js';

// Get customer recommendations
export const getCustomerRecommendations: RequestHandler = async (req, res) => {
  try {
    const { phone } = req.params;
    const { limit = '6' } = req.query;

    // Get customer
    const customerResult = await db.query(`
      SELECT c.id, ca.favorite_category_id, ca.favorite_products
      FROM clients c
      LEFT JOIN customer_analytics ca ON c.id = ca.client_id
      WHERE c.phone = $1
    `, [phone]);

    if (customerResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Customer not found'
      });
    }

    const customer = customerResult.rows[0];
    const orderedProductIds = await getCustomerOrderHistory(customer.id);
    let recommendations = [];

    // Strategy 1: Recommend from favorite category
    if (customer.favorite_category_id) {
      const categoryRecs = await getCategoryRecommendations(
        customer.favorite_category_id, 
        orderedProductIds, 
        Math.floor(parseInt(limit as string) / 2)
      );
      recommendations = [...recommendations, ...categoryRecs];
    }

    // Strategy 2: Collaborative filtering
    if (orderedProductIds.length > 0) {
      const collaborativeRecs = await getCollaborativeRecommendations(
        customer.id, 
        orderedProductIds, 
        Math.floor(parseInt(limit as string) / 2)
      );
      recommendations = [...recommendations, ...collaborativeRecs];
    }

    // Strategy 3: Fill remaining slots with popular products
    const remainingSlots = parseInt(limit as string) - recommendations.length;
    if (remainingSlots > 0) {
      const popularRecs = await getPopularRecommendations(
        orderedProductIds, 
        recommendations, 
        remainingSlots
      );
      recommendations = [...recommendations, ...popularRecs];
    }

    res.json({
      success: true,
      data: {
        recommendations: recommendations.slice(0, parseInt(limit as string)),
        strategies_used: [
          customer.favorite_category_id ? 'favorite_category' : null,
          orderedProductIds.length > 0 ? 'collaborative' : null,
          'popular'
        ].filter(Boolean)
      }
    });

  } catch (error) {
    console.error('Get customer recommendations error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch recommendations'
    });
  }
};
