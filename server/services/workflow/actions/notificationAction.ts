import { db } from '../../../database/connection';
import { WorkflowAction, WorkflowEventData } from '../types';

// =====================================================
// NOTIFICATION ACTION EXECUTOR
// =====================================================

export async function executeNotificationAction(
  action: WorkflowAction, 
  data: WorkflowEventData
): Promise<any> {
  const { type, message, priority = 'normal' } = action.config;
  
  if (type === 'admin') {
    // Créer une notification pour tous les admins
    const adminUsers = await db.query('SELECT id FROM admin_users WHERE is_active = true');
    
    for (const admin of adminUsers.rows) {
      await db.query(`
        INSERT INTO notifications (
          recipient_type, recipient_id, type, title, message, priority, created_at
        ) VALUES ('admin', $1, 'workflow', $2, $3, $4, CURRENT_TIMESTAMP)
      `, [
        admin.id, 
        'Notification Workflow', 
        message, 
        priority === 'high' ? 2 : priority === 'medium' ? 1 : 0
      ]);
    }
    
    return { notificationsSent: adminUsers.rows.length };
  }
  
  return { status: 'notification_type_not_supported' };
}
