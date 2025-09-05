import { emailService } from '../../emailService-v2';
import { WorkflowAction, WorkflowEventData } from '../types';

// =====================================================
// EMAIL ACTION EXECUTOR
// =====================================================

export async function executeEmailAction(
  action: WorkflowAction, 
  data: WorkflowEventData
): Promise<any> {
  const { template, to } = action.config;
  
  let recipient: string;
  
  if (to === 'customer') {
    recipient = data.customer_email || (data as any).email;
  } else if (to === 'admins') {
    // Pour les admins, on utilise la méthode du service email
    if (template === 'admin_payment_notification') {
      return await emailService.sendPaymentNotificationToAdmin(data.orderId || data.entityId);
    }
    // Autres cas admin...
    return { status: 'admin_notification_sent' };
  } else {
    recipient = to;
  }

  if (!recipient) {
    throw new Error('No recipient email found');
  }

  // Mapping des templates vers les méthodes du service email
  switch (template) {
    case 'order_confirmation':
      return await emailService.sendOrderConfirmation(data.orderId || data.entityId);
    
    case 'order_status_update':
      return await emailService.sendOrderStatusUpdate(
        data.orderId || data.entityId, 
        (data as any).newStatus || (data as any).status
      );
    
    case 'review_request':
      return await emailService.sendReviewRequest(data.orderId || data.entityId);
    
    default:
      // Email générique
      return await emailService.sendEmail({
        templateCode: template,
        recipient,
        variables: data,
        orderId: data.orderId,
        customerId: (data as any).customerId
      });
  }
}
