// =====================================================
// ADMIN EMAIL WORKFLOWS
// =====================================================

import { db } from '../../../database/connection';
import { OrderData, EmailData } from '../types';

export class AdminWorkflows {
  // Récupérer les emails des administrateurs
  async getAdminEmails(): Promise<string[]> {
    try {
      const result = await db.query(`
        SELECT email FROM admin_users 
        WHERE is_active = true AND email IS NOT NULL
      `);
      return result.rows.map(row => row.email);
    } catch (error) {
      console.error('Failed to get admin emails:', error);
      return [];
    }
  }

  // Préparer les données pour la notification admin de paiement
  preparePaymentNotificationData(order: OrderData): EmailData[] {
    const variables = {
      order_number: order.order_number,
      customer_name: order.first_name 
        ? `${order.first_name} ${order.last_name || ''}`.trim()
        : order.customer_name || 'Client',
      customer_phone: order.phone || order.customer_phone,
      total_amount: `${order.total_amount} DH`,
      admin_link: `${process.env.BASE_URL}/admin/orders/${order.id}`,
      payment_proof_link: `${process.env.BASE_URL}/admin/payments/verify/${order.id}`
    };

    // Retourner un tableau d'EmailData pour chaque admin
    return [{
      templateCode: 'admin_payment_notification',
      recipient: '', // Will be filled by the service for each admin
      variables,
      orderId: order.id,
      priority: 'high'
    }];
  }

  // Préparer d'autres notifications admin si nécessaire
  prepareOrderNotificationData(order: OrderData): EmailData[] {
    const variables = {
      order_number: order.order_number,
      customer_name: order.first_name 
        ? `${order.first_name} ${order.last_name || ''}`.trim()
        : order.customer_name || 'Client',
      customer_phone: order.phone || order.customer_phone,
      total_amount: `${order.total_amount} DH`,
      admin_link: `${process.env.BASE_URL}/admin/orders/${order.id}`
    };

    return [{
      templateCode: 'admin_new_order_notification',
      recipient: '', // Will be filled by the service for each admin
      variables,
      orderId: order.id,
      priority: 'normal'
    }];
  }
}
