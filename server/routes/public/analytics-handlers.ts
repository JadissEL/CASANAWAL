// =====================================================
// ANALYTICS TRACKING HANDLERS (≤150 lines)
// =====================================================

import { RequestHandler } from "express";
import { db } from "../../database/connection";

interface ActivityEvent {
  event_type: string;
  page?: string;
  product_id?: string;
  category?: string;
  search_query?: string;
  user_agent?: string;
  referrer?: string;
}

// Track user activity for analytics
export const trackActivity: RequestHandler = async (req, res) => {
  try {
    const { 
      event_type, 
      page, 
      product_id, 
      category, 
      search_query,
      user_agent,
      referrer 
    }: ActivityEvent = req.body;

    if (!event_type) {
      return res.status(400).json({
        success: false,
        error: 'Event type is required'
      });
    }

    // Get client IP
    const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    // Update real-time metrics based on event type
    await updateRealtimeMetrics(event_type, product_id);

    // Log additional analytics if needed
    await logAnalyticsEvent({
      event_type,
      page,
      product_id,
      category,
      search_query,
      user_agent,
      referrer,
      client_ip: clientIP as string,
      timestamp: new Date()
    });

    res.json({
      success: true,
      data: {
        tracked: true,
        event_type,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Track activity error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to track activity'
    });
  }
};

// Update real-time metrics based on event type
const updateRealtimeMetrics = async (eventType: string, productId?: string) => {
  try {
    switch (eventType) {
      case 'page_view':
        await db.query(`
          UPDATE realtime_metrics 
          SET metric_value = metric_value + 1, last_updated = NOW()
          WHERE metric_name = 'online_customers'
        `);
        break;
        
      case 'product_view':
        if (productId) {
          await db.query(`
            INSERT INTO product_analytics (product_id, analytics_date, views_count)
            VALUES ($1, CURRENT_DATE, 1)
            ON CONFLICT (product_id, analytics_date)
            DO UPDATE SET views_count = product_analytics.views_count + 1
          `, [productId]);
        }
        break;
        
      case 'add_to_cart':
        await db.query(`
          UPDATE realtime_metrics 
          SET metric_value = metric_value + 1, last_updated = NOW()
          WHERE metric_name = 'conversion_rate'
        `);
        break;

      case 'search':
        await db.query(`
          UPDATE realtime_metrics 
          SET metric_value = metric_value + 1, last_updated = NOW()
          WHERE metric_name = 'search_queries'
        `);
        break;
    }
  } catch (error) {
    console.error('Error updating realtime metrics:', error);
  }
};

// Logging function simplified
const logAnalyticsEvent = async (eventData: any) => {
  try {
    if (['product_view', 'add_to_cart', 'order_completed'].includes(eventData.event_type)) {
      await db.query(`
        INSERT INTO user_activity_log (event_type, product_id, page, client_ip, user_agent, created_at) 
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [eventData.event_type, eventData.product_id, eventData.page, eventData.client_ip, eventData.user_agent, eventData.timestamp]);
    }
  } catch (error) {
    console.error('Error logging analytics event:', error);
  }
};

// Utility functions moved to analytics-utils.ts to keep file under 150 lines
