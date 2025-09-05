// =====================================================
// ORDER EMAIL WORKFLOWS
// =====================================================

import { db } from '../../../database/connection';
import { OrderData, EmailData } from '../types';

export class OrderWorkflows {
  // Récupérer les données de commande
  async getOrderData(orderId: string): Promise<OrderData | null> {
    try {
      const result = await db.query(`
        SELECT o.*, c.first_name, c.last_name, c.email, c.phone,
               os.name as status_name, os.color as status_color
        FROM orders o
        LEFT JOIN customers c ON o.customer_id = c.id
        LEFT JOIN order_statuses os ON o.status_id = os.id
        WHERE o.id = $1
      `, [orderId]);

      if (result.rows.length === 0) {
        return null;
      }

      return result.rows[0];
    } catch (error) {
      console.error('Failed to get order data:', error);
      return null;
    }
  }

  // Préparer les données pour l'email de confirmation de commande
  prepareOrderConfirmationData(order: OrderData): EmailData | null {
    const customerEmail = order.email || order.customer_email;
    
    if (!customerEmail) {
      console.log('No email provided for order confirmation');
      return null;
    }

    const variables = {
      customer_name: order.first_name 
        ? `${order.first_name} ${order.last_name || ''}`.trim()
        : order.customer_name || 'Cher client',
      order_number: order.order_number,
      reference_code: order.reference_code,
      total_amount: `${order.total_amount} DH`,
      deposit_amount: `${order.deposit_amount || 0} DH`,
      remaining_amount: `${order.remaining_amount || 0} DH`,
      delivery_date: order.preferred_delivery_date || 'À définir',
      delivery_time: order.preferred_delivery_time || 'À définir',
      payment_link: `${process.env.BASE_URL}/payment/${order.reference_code}`,
      tracking_link: `${process.env.BASE_URL}/suivi/${order.reference_code}`,
      company_name: 'CasaNawal',
      contact_phone: process.env.CONTACT_PHONE || '+212 6 00 00 00 00',
      contact_email: process.env.CONTACT_EMAIL || 'contact@casanawal.ma'
    };

    return {
      templateCode: 'order_confirmation',
      recipient: customerEmail,
      variables,
      orderId: order.id,
      customerId: order.customer_id,
      priority: 'high'
    };
  }

  // Préparer les données pour l'email de mise à jour de statut
  prepareOrderStatusUpdateData(order: OrderData, newStatus: string): EmailData | null {
    const customerEmail = order.email || order.customer_email;
    
    if (!customerEmail) {
      console.log('No email provided for status update');
      return null;
    }

    const variables = {
      customer_name: order.first_name 
        ? `${order.first_name} ${order.last_name || ''}`.trim()
        : order.customer_name || 'Cher client',
      order_number: order.order_number,
      reference_code: order.reference_code,
      status_name: order.status_name || newStatus,
      tracking_link: `${process.env.BASE_URL}/suivi/${order.reference_code}`,
      estimated_delivery: order.estimated_delivery_at 
        ? new Date(order.estimated_delivery_at).toLocaleString('fr-FR')
        : 'À définir'
    };

    return {
      templateCode: 'order_status_update',
      recipient: customerEmail,
      variables,
      orderId: order.id,
      customerId: order.customer_id,
      priority: 'normal'
    };
  }

  // Préparer les données pour l'email de demande d'avis
  prepareReviewRequestData(order: OrderData): EmailData | null {
    const customerEmail = order.email || order.customer_email;
    
    if (!customerEmail) {
      console.log('No email provided for review request');
      return null;
    }

    if (!order.delivered_at) {
      console.log('Order not delivered yet');
      return null;
    }

    const variables = {
      customer_name: order.first_name 
        ? `${order.first_name} ${order.last_name || ''}`.trim()
        : order.customer_name || 'Cher client',
      order_number: order.order_number,
      review_link: `${process.env.BASE_URL}/avis/${order.reference_code}`,
      company_name: 'CasaNawal'
    };

    // Programmer l'envoi 24h après la livraison
    const scheduledAt = new Date(order.delivered_at);
    scheduledAt.setHours(scheduledAt.getHours() + 24);

    return {
      templateCode: 'review_request',
      recipient: customerEmail,
      variables,
      orderId: order.id,
      customerId: order.customer_id,
      priority: 'low',
      scheduledAt
    };
  }
}
