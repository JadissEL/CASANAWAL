// =====================================================
// DELIVERY & TIME SLOT HANDLERS (≤150 lines)
// =====================================================

import { RequestHandler } from "express";
import { db } from "../../database/connection";

// Default delivery zones
const DEFAULT_DELIVERY_ZONES = [
  { name: "Centre-ville", fee: 10, min_order: 80 },
  { name: "Quartier administratif", fee: 15, min_order: 100 },
  { name: "Zone industrielle", fee: 20, min_order: 120 },
  { name: "Périphérie", fee: 25, min_order: 150 }
];

// Default time slots with capacity
const DEFAULT_TIME_SLOTS = [
  { id: "lunch-early", label: "11:30 - 12:30", capacity: 15 },
  { id: "lunch", label: "12:30 - 14:00", capacity: 25 },
  { id: "lunch-late", label: "14:00 - 15:30", capacity: 15 },
  { id: "afternoon", label: "15:30 - 17:00", capacity: 10 },
  { id: "dinner-early", label: "17:00 - 18:30", capacity: 20 },
  { id: "dinner", label: "18:30 - 20:00", capacity: 30 },
  { id: "dinner-late", label: "20:00 - 21:30", capacity: 20 }
];

// Get delivery zones and pricing
export const getDeliveryZones: RequestHandler = async (req, res) => {
  try {
    // Try to get from database first
    const zonesResult = await db.query(`
      SELECT setting_value 
      FROM system_settings 
      WHERE setting_key = 'delivery_zones'
    `);

    let zones = DEFAULT_DELIVERY_ZONES;
    
    if (zonesResult.rows.length > 0 && zonesResult.rows[0].setting_value) {
      try {
        zones = JSON.parse(zonesResult.rows[0].setting_value);
      } catch (parseError) {
        console.warn('Failed to parse delivery zones from database, using defaults');
      }
    }

    // Get minimum order amount
    const minOrderResult = await db.query(`
      SELECT setting_value 
      FROM system_settings 
      WHERE setting_key = 'minimum_order_amount'
    `);

    const minimumOrderAmount = minOrderResult.rows.length > 0 
      ? parseInt(minOrderResult.rows[0].setting_value) 
      : 50;

    res.json({
      success: true,
      data: {
        zones,
        minimum_order_amount: minimumOrderAmount,
        currency: "MAD"
      }
    });

  } catch (error) {
    console.error('Get delivery zones error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch delivery zones'
    });
  }
};

// Get available time slots
export const getAvailableTimeSlots: RequestHandler = async (req, res) => {
  try {
    const { date, zone } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        error: 'Date is required'
      });
    }

    const selectedDate = new Date(date as string);
    const today = new Date();
    
    // Validate date (not in the past, not more than 7 days ahead)
    if (selectedDate < today || selectedDate > new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid date. Please select a date within the next 7 days.'
      });
    }

    // Get existing orders for the date
    const existingOrders = await db.query(`
      SELECT delivery_slot, COUNT(*) as order_count
      FROM orders 
      WHERE delivery_date = $1 
        AND status NOT IN ('cancelled')
        AND ($2::text IS NULL OR metadata->>'zone' = $2)
      GROUP BY delivery_slot
    `, [date, zone]);

    const orderCounts = new Map();
    existingOrders.rows.forEach(row => {
      orderCounts.set(row.delivery_slot, parseInt(row.order_count));
    });

    // Check availability and add current load
    const availableSlots = DEFAULT_TIME_SLOTS.map(slot => {
      const currentOrders = orderCounts.get(slot.id) || 0;
      const isAvailable = currentOrders < slot.capacity;
      
      // Check if time has passed for today
      let isPastTime = false;
      if (selectedDate.toDateString() === today.toDateString()) {
        const currentHour = today.getHours();
        const slotStartHour = parseInt(slot.label.split(':')[0]);
        isPastTime = currentHour >= slotStartHour;
      }

      return {
        ...slot,
        available: isAvailable && !isPastTime,
        current_orders: currentOrders,
        remaining_capacity: Math.max(0, slot.capacity - currentOrders),
        status: isPastTime ? 'past' : (isAvailable ? 'available' : 'full')
      };
    });

    res.json({
      success: true,
      data: {
        date: date,
        zone: zone || 'all',
        slots: availableSlots,
        total_capacity: DEFAULT_TIME_SLOTS.reduce((sum, slot) => sum + slot.capacity, 0),
        total_booked: Array.from(orderCounts.values()).reduce((sum, count) => sum + count, 0)
      }
    });

  } catch (error) {
    console.error('Get available time slots error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch available time slots'
    });
  }
};

// Helper functions moved to delivery-utils.ts to maintain ≤150 lines
