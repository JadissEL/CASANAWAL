// =====================================================
// CUSTOMER PROFILE HANDLERS - REFACTORED FROM CUSTOMERS.TS (≤150 lines)
// =====================================================

import { RequestHandler } from "express";
import { db } from "../../database/connection";
import { 
  getCustomerWithAnalytics, 
  getCustomerRecentOrders, 
  getCustomerFavoriteProducts, 
  getCustomerDeliveryStats,
  formatCustomerProfileResponse
} from './customer-profile-utils.js';

// Get customer profile
export const getCustomerProfile: RequestHandler = async (req, res) => {
  try {
    const { phone } = req.params;

    const customerResult = await getCustomerWithAnalytics(phone);

    if (customerResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Customer not found'
      });
    }

    const customer = customerResult.rows[0];

    // Get related data
    const recentOrdersResult = await getCustomerRecentOrders(customer.id);
    const favoriteProducts = await getCustomerFavoriteProducts(customer.favorite_products);
    const deliveryStats = await getCustomerDeliveryStats(customer.id);

    // Format and send response
    const responseData = formatCustomerProfileResponse(
      customer, 
      recentOrdersResult.rows, 
      favoriteProducts, 
      deliveryStats
    );

    res.json({
      success: true,
      data: responseData
    });

  } catch (error) {
    console.error('Get customer profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch customer profile'
    });
  }
};

// Update customer profile
export const updateCustomerProfile: RequestHandler = async (req, res) => {
  try {
    const { phone } = req.params;
    const { 
      email, 
      first_name, 
      last_name, 
      default_address, 
      preferences 
    } = req.body;

    // Check if customer exists
    const existingCustomer = await db.query(
      'SELECT id FROM clients WHERE phone = $1',
      [phone]
    );

    if (existingCustomer.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Customer not found'
      });
    }

    // Update customer
    const updatedCustomer = await db.query(`
      UPDATE clients 
      SET 
        email = COALESCE($2, email),
        first_name = COALESCE($3, first_name),
        last_name = COALESCE($4, last_name),
        default_address = COALESCE($5, default_address),
        preferences = COALESCE($6, preferences)
      WHERE phone = $1
      RETURNING *
    `, [phone, email, first_name, last_name, default_address, JSON.stringify(preferences)]);

    res.json({
      success: true,
      data: {
        customer: updatedCustomer.rows[0],
        message: 'Profile updated successfully'
      }
    });

  } catch (error) {
    console.error('Update customer profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update customer profile'
    });
  }
};
