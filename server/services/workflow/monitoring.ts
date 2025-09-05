import { db } from '../../database/connection';

// =====================================================
// WORKFLOW MONITORING & STATISTICS
// =====================================================

export async function getWorkflowStats(days: number = 7): Promise<any> {
  const result = await db.query(`
    SELECT 
      wt.name,
      wt.event,
      COUNT(we.id) as executions,
      COUNT(CASE WHEN we.status = 'completed' THEN 1 END) as successful,
      COUNT(CASE WHEN we.status = 'failed' THEN 1 END) as failed
    FROM workflow_triggers wt
    LEFT JOIN workflow_executions we ON wt.id = we.trigger_id 
      AND we.started_at >= CURRENT_DATE - INTERVAL '${days} days'
    WHERE wt.is_active = true
    GROUP BY wt.id, wt.name, wt.event
    ORDER BY executions DESC
  `);

  return result.rows;
}

export async function getRecentExecutions(limit: number = 50): Promise<any> {
  const result = await db.query(`
    SELECT 
      we.*,
      wt.name as workflow_name,
      wt.event
    FROM workflow_executions we
    JOIN workflow_triggers wt ON we.trigger_id = wt.id
    ORDER BY we.started_at DESC
    LIMIT $1
  `, [limit]);

  return result.rows;
}

export async function checkWorkflowHealth(workflowsLoaded: number, isInitialized: boolean): Promise<{ status: string; details: any }> {
  try {
    const recentExecutions = await db.query(`
      SELECT status, COUNT(*) as count
      FROM workflow_executions 
      WHERE started_at >= CURRENT_DATE - INTERVAL '24 hours'
      GROUP BY status
    `);

    return {
      status: 'healthy',
      details: {
        workflowsLoaded,
        initialized: isInitialized,
        last24hExecutions: recentExecutions.rows
      }
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      details: {
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    };
  }
}
