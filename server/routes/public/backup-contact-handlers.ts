// =====================================================
// CONTACT HANDLERS - REFACTORED FROM BACKUP (≤150 lines)
// =====================================================

import { RequestHandler } from "express";
import { db } from "../../database/connection";

// Default opening hours
const DEFAULT_OPENING_HOURS = {
  monday: { open: "11:00", close: "22:00", closed: false },
  tuesday: { open: "11:00", close: "22:00", closed: false },
  wednesday: { open: "11:00", close: "22:00", closed: false },
  thursday: { open: "11:00", close: "22:00", closed: false },
  friday: { open: "11:00", close: "22:00", closed: false },
  saturday: { open: "11:00", close: "23:00", closed: false },
  sunday: { open: "12:00", close: "22:00", closed: false }
};

// Get contact information and business hours
export const getContactInfo: RequestHandler = async (req, res) => {
  try {
    // Get current day and time
    const now = new Date();
    const currentDay = now.toLocaleDateString('en', { weekday: 'long' }).toLowerCase();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour * 60 + currentMinute;

    // Calculate if currently open
    const todayHours = DEFAULT_OPENING_HOURS[currentDay as keyof typeof DEFAULT_OPENING_HOURS];
    let isOpen = false;
    let nextOpenTime = null;

    if (todayHours && !todayHours.closed) {
      const openTime = parseInt(todayHours.open.split(':')[0]) * 60 + parseInt(todayHours.open.split(':')[1]);
      const closeTime = parseInt(todayHours.close.split(':')[0]) * 60 + parseInt(todayHours.close.split(':')[1]);
      
      isOpen = currentTime >= openTime && currentTime <= closeTime;
      
      if (!isOpen && currentTime < openTime) {
        nextOpenTime = todayHours.open;
      }
    }

    // Get recent customer feedback
    const avgRatings = await getAverageRatings();

    res.json({
      success: true,
      data: {
        restaurant: {
          name: "CasaNawal",
          description: "Cuisine marocaine authentique et moderne",
          phone: "+212 5XX-XXXXXX",
          email: "contact@casanawal.ma",
          address: "123 Boulevard Mohammed V, Casablanca, Maroc",
          website: "https://casanawal.ma"
        },
        business_hours: {
          hours: DEFAULT_OPENING_HOURS,
          currently_open: isOpen,
          next_open_time: nextOpenTime,
          timezone: "Africa/Casablanca"
        },
        social_media: {
          facebook: "https://facebook.com/casanawal",
          instagram: "https://instagram.com/casanawal",
          twitter: "https://twitter.com/casanawal"
        },
        ratings: avgRatings,
        delivery_info: {
          available_zones: ["Centre-ville", "Quartier administratif", "Zone industrielle", "Périphérie"],
          delivery_hours: "11:00 - 21:30",
          minimum_order: 50
        }
      }
    });

  } catch (error) {
    console.error('Get contact info error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch contact information'
    });
  }
};

// Helper function to get average ratings
const getAverageRatings = async () => {
  try {
    const recentFeedback = await db.query(`
      SELECT 
        overall_rating,
        food_quality_rating,
        delivery_rating,
        service_rating,
        would_recommend
      FROM customer_feedback 
      WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
        AND overall_rating IS NOT NULL
    `);

    if (recentFeedback.rows.length === 0) {
      return null;
    }

    const ratings = recentFeedback.rows;
    return {
      overall: (ratings.reduce((sum, r) => sum + (r.overall_rating || 0), 0) / ratings.length).toFixed(1),
      food_quality: (ratings.reduce((sum, r) => sum + (r.food_quality_rating || 0), 0) / ratings.length).toFixed(1),
      delivery: (ratings.reduce((sum, r) => sum + (r.delivery_rating || 0), 0) / ratings.length).toFixed(1),
      service: (ratings.reduce((sum, r) => sum + (r.service_rating || 0), 0) / ratings.length).toFixed(1),
      recommendation_rate: (ratings.filter(r => r.would_recommend).length / ratings.length * 100).toFixed(0)
    };
  } catch (error) {
    console.error('Error getting average ratings:', error);
    return null;
  }
};

// Helper function to check if restaurant is open
export const isRestaurantOpen = (): boolean => {
  const now = new Date();
  const currentDay = now.toLocaleDateString('en', { weekday: 'long' }).toLowerCase();
  const currentTime = now.getHours() * 60 + now.getMinutes();
  
  const todayHours = DEFAULT_OPENING_HOURS[currentDay as keyof typeof DEFAULT_OPENING_HOURS];
  
  if (!todayHours || todayHours.closed) {
    return false;
  }
  
  const openTime = parseInt(todayHours.open.split(':')[0]) * 60 + parseInt(todayHours.open.split(':')[1]);
  const closeTime = parseInt(todayHours.close.split(':')[0]) * 60 + parseInt(todayHours.close.split(':')[1]);
  
  return currentTime >= openTime && currentTime <= closeTime;
};
