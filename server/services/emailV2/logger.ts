// =====================================================
// EMAIL LOGGING SERVICE
// =====================================================

import { db } from '../../database/connection';
import { EmailLog, EmailLoggerInterface } from './types';

export class EmailLogger implements EmailLoggerInterface {
  async createEmailLog(logData: Partial<EmailLog>): Promise<string> {
    const result = await db.query(`
      INSERT INTO email_logs (
        template_id, recipient_email, subject, status, 
        order_id, customer_id, error_message, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP)
      RETURNING id
    `, [
      logData.templateId,
      logData.recipientEmail,
      logData.subject,
      logData.status || 'pending',
      logData.orderId || null,
      logData.customerId || null,
      logData.errorMessage || null
    ]);

    return result.rows[0].id;
  }

  async updateEmailLog(logId: string, updates: Partial<EmailLog & { providerMessageId?: string }>): Promise<void> {
    const setClause: string[] = [];
    const values: any[] = [logId];
    let paramIndex = 2;

    if (updates.status) {
      setClause.push(`status = $${paramIndex++}`);
      values.push(updates.status);
    }

    if (updates.sentAt) {
      setClause.push(`sent_at = $${paramIndex++}`);
      values.push(updates.sentAt);
    }

    if (updates.deliveredAt) {
      setClause.push(`delivered_at = $${paramIndex++}`);
      values.push(updates.deliveredAt);
    }

    if (updates.openedAt) {
      setClause.push(`opened_at = $${paramIndex++}`);
      values.push(updates.openedAt);
    }

    if (updates.errorMessage) {
      setClause.push(`error_message = $${paramIndex++}`);
      values.push(updates.errorMessage);
    }

    if (updates.providerMessageId) {
      setClause.push(`provider_message_id = $${paramIndex++}`);
      values.push(updates.providerMessageId);
    }

    if (setClause.length > 0) {
      await db.query(
        `UPDATE email_logs SET ${setClause.join(', ')} WHERE id = $1`,
        values
      );
    }
  }

  async getEmailStats(days: number = 7): Promise<any> {
    try {
      const result = await db.query(`
        SELECT 
          DATE(created_at) as date,
          status,
          COUNT(*) as count
        FROM email_logs 
        WHERE created_at >= CURRENT_DATE - INTERVAL '${days} days'
        GROUP BY DATE(created_at), status
        ORDER BY date DESC
      `);

      return result.rows;
    } catch (error) {
      console.error('Failed to get email stats:', error);
      return [];
    }
  }

  async getEmailLogs(orderId?: string, limit: number = 50): Promise<EmailLog[]> {
    try {
      let query = `
        SELECT id, template_id, recipient_email, subject, status, 
               sent_at, delivered_at, opened_at, error_message,
               order_id, customer_id, created_at
        FROM email_logs
      `;
      
      const params: any[] = [];
      
      if (orderId) {
        query += ` WHERE order_id = $1`;
        params.push(orderId);
      }
      
      query += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
      params.push(limit);
      
      const result = await db.query(query, params);
      return result.rows.map(row => ({
        id: row.id,
        templateId: row.template_id,
        recipientEmail: row.recipient_email,
        subject: row.subject,
        status: row.status,
        sentAt: row.sent_at,
        deliveredAt: row.delivered_at,
        openedAt: row.opened_at,
        errorMessage: row.error_message,
        orderId: row.order_id,
        customerId: row.customer_id
      }));
    } catch (error) {
      console.error('Error fetching email logs:', error);
      return [];
    }
  }
}
