// =====================================================
// ANALYTICS UTILITIES (≤150 lines)
// =====================================================

import { db } from "../../database/connection";

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

export const trackConversionFunnel = async (sessionId: string, step: string) => {
  try {
    await db.query(`
      INSERT INTO conversion_funnel (
        session_id, 
        funnel_step, 
        timestamp
      ) VALUES ($1, $2, NOW())
      ON CONFLICT (session_id, funnel_step) 
      DO UPDATE SET timestamp = NOW()
    `, [sessionId, step]);
  } catch (error) {
    console.error('Error tracking conversion funnel:', error);
  }
};
