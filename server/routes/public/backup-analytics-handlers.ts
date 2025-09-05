// =====================================================
// ANALYTICS HANDLERS - REFACTORED FROM BACKUP (≤150 lines)
// =====================================================

import { RequestHandler } from "express";
import { db } from "../../database/connection";

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
    } = req.body;

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

    // Log activity for tracking
    await logActivityEvent({
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

// Simplified metrics update
const updateRealtimeMetrics = async (eventType: string, productId?: string) => {
  try {
    if (eventType === 'page_view') {
      await db.query(`UPDATE realtime_metrics SET metric_value = metric_value + 1, last_updated = NOW() WHERE metric_name = 'online_customers'`);
    } else if (eventType === 'product_view' && productId) {
      await db.query(`INSERT INTO product_analytics (product_id, analytics_date, views_count) VALUES ($1, CURRENT_DATE, 1) ON CONFLICT (product_id, analytics_date) DO UPDATE SET views_count = product_analytics.views_count + 1`, [productId]);
    } else if (eventType === 'add_to_cart') {
      await db.query(`UPDATE realtime_metrics SET metric_value = metric_value + 1, last_updated = NOW() WHERE metric_name = 'conversion_rate'`);
    }
  } catch (error) {
    console.error('Error updating realtime metrics:', error);
  }
};

// Simplified activity logging
const logActivityEvent = async (eventData: any) => {
  try {
    if (['product_view', 'add_to_cart', 'order_completed'].includes(eventData.event_type)) {
      await db.query(`INSERT INTO user_activity_log (event_type, product_id, page, client_ip, user_agent, created_at) VALUES ($1, $2, $3, $4, $5, $6)`, 
        [eventData.event_type, eventData.product_id, eventData.page, eventData.client_ip, eventData.user_agent, eventData.timestamp]);
    }
  } catch (error) {
    console.error('Error logging analytics event:', error);
  }
};

// Helper function to get analytics summary
export const getAnalyticsSummary = async (days: number = 7) => {
  try {
    const summary = await db.query(`
      SELECT 
        event_type,
        COUNT(*) as event_count,
        DATE(created_at) as event_date
      FROM user_activity_log
      WHERE created_at >= CURRENT_DATE - INTERVAL '${days} days'
      GROUP BY event_type, DATE(created_at)
      ORDER BY event_date DESC, event_count DESC
    `);

    return summary.rows;
  } catch (error) {
    console.error('Error getting analytics summary:', error);
    return [];
  }
};
