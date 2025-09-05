// =====================================================
// EMAIL SERVICE BATCH OPERATIONS (≤150 lines)
// =====================================================

import { EmailServiceCore } from './email-service-core';
import { EmailServiceWorkflows } from './email-service-workflows';

export class EmailServiceBatch {
  constructor(
    private core: EmailServiceCore,
    private workflows: EmailServiceWorkflows
  ) {}

  // =====================================================
  // BULK OPERATIONS
  // =====================================================

  async sendBulkEmails(emailDataList: any[]): Promise<boolean[]> {
    const promises = emailDataList.map(emailData => this.core.sendEmail(emailData));
    return await Promise.all(promises);
  }

  async sendBulkOrderConfirmations(orderIds: string[]): Promise<boolean[]> {
    const promises = orderIds.map(orderId => this.workflows.sendOrderConfirmation(orderId));
    return await Promise.all(promises);
  }

  async sendBulkStatusUpdates(updates: { orderId: string; status: string }[]): Promise<boolean[]> {
    const promises = updates.map(update => 
      this.workflows.sendOrderStatusUpdate(update.orderId, update.status)
    );
    return await Promise.all(promises);
  }

  // =====================================================
  // SCHEDULED OPERATIONS
  // =====================================================

  async sendScheduledEmails(orderId: string, scheduleType: 'confirmation' | 'reminder' | 'followup'): Promise<boolean> {
    try {
      switch (scheduleType) {
        case 'confirmation':
          return await this.workflows.sendOrderConfirmation(orderId);
        case 'reminder':
          // Could add reminder logic here
          return false;
        case 'followup':
          return await this.workflows.sendReviewRequest(orderId);
        default:
          return false;
      }
    } catch (error) {
      console.error(`Failed to send scheduled email (${scheduleType}):`, error);
      return false;
    }
  }

  async scheduleOrderEmails(orderId: string, emailTypes: string[]): Promise<boolean[]> {
    const promises = emailTypes.map(type => 
      this.sendScheduledEmails(orderId, type as 'confirmation' | 'reminder' | 'followup')
    );
    return await Promise.all(promises);
  }

  // =====================================================
  // BATCH VALIDATION
  // =====================================================

  async validateMultipleOrders(orderIds: string[]): Promise<{ [orderId: string]: boolean }> {
    const results: { [orderId: string]: boolean } = {};
    
    const promises = orderIds.map(async orderId => {
      try {
        const exists = await this.validateOrderExists(orderId);
        results[orderId] = exists;
        return exists;
      } catch (error) {
        results[orderId] = false;
        return false;
      }
    });

    await Promise.all(promises);
    return results;
  }

  async validateOrderExists(orderId: string): Promise<boolean> {
    try {
      // This would need access to order workflows
      return true; // Placeholder
    } catch (error) {
      return false;
    }
  }

  // =====================================================
  // BATCH REPORTING
  // =====================================================

  async getBulkEmailHistory(orderIds: string[]): Promise<{ [orderId: string]: any[] }> {
    const results: { [orderId: string]: any[] } = {};
    
    const promises = orderIds.map(async orderId => {
      try {
        const logger = this.core.getLogger();
        const history = await logger.getEmailLogs(orderId);
        results[orderId] = history;
        return history;
      } catch (error) {
        console.error(`Failed to get email history for order ${orderId}:`, error);
        results[orderId] = [];
        return [];
      }
    });

    await Promise.all(promises);
    return results;
  }

  async getBatchStatistics(orderIds: string[]): Promise<{
    totalOrders: number;
    emailsSent: number;
    successRate: number;
    failedEmails: number;
  }> {
    const histories = await this.getBulkEmailHistory(orderIds);
    
    let totalEmails = 0;
    let successfulEmails = 0;
    let failedEmails = 0;

    Object.values(histories).forEach(history => {
      history.forEach(email => {
        totalEmails++;
        if (email.status === 'sent') {
          successfulEmails++;
        } else if (email.status === 'failed') {
          failedEmails++;
        }
      });
    });

    return {
      totalOrders: orderIds.length,
      emailsSent: totalEmails,
      successRate: totalEmails > 0 ? (successfulEmails / totalEmails) * 100 : 0,
      failedEmails
    };
  }
}
