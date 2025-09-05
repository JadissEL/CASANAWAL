import { db } from '../../database/connection';
import { EmailLog } from './types';

// =====================================================
// EMAIL LOGGING SERVICE
// =====================================================

export async function logEmailSent(
  recipient: string,
  subject: string,
  type: string,
  orderId: string
): Promise<void> {
  try {
    await db.query(`
      INSERT INTO email_logs (recipient, subject, type, order_id, sent_at, status)
      VALUES ($1, $2, $3, $4, NOW(), 'sent')
    `, [recipient, subject, type, orderId]);
    
    console.log(`Email logged as sent: ${type} to ${recipient} for order ${orderId}`);
  } catch (error) {
    console.error('Error logging email sent:', error);
  }
}

export async function logEmailFailed(
  recipient: string,
  subject: string,
  type: string,
  orderId: string,
  errorMessage: string
): Promise<void> {
  try {
    await db.query(`
      INSERT INTO email_logs (recipient, subject, type, order_id, sent_at, status, error_message)
      VALUES ($1, $2, $3, $4, NOW(), 'failed', $5)
    `, [recipient, subject, type, orderId, errorMessage]);
    
    console.log(`Email logged as failed: ${type} to ${recipient} for order ${orderId}`);
  } catch (error) {
    console.error('Error logging email failure:', error);
  }
}

export async function getEmailLogs(orderId?: string, limit: number = 50): Promise<EmailLog[]> {
  try {
    let query = `
      SELECT recipient, subject, type, order_id, sent_at, status, error_message
      FROM email_logs
    `;
    
    const params: any[] = [];
    
    if (orderId) {
      query += ` WHERE order_id = $1`;
      params.push(orderId);
    }
    
    query += ` ORDER BY sent_at DESC LIMIT $${params.length + 1}`;
    params.push(limit);
    
    const result = await db.query(query, params);
    return result.rows;
  } catch (error) {
    console.error('Error fetching email logs:', error);
    return [];
  }
}
