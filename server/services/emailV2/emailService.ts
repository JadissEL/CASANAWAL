// =====================================================
// MAIN EMAIL SERVICE V2 (≤150 lines)
// =====================================================

import { EmailData, EmailServiceV2Interface } from './types';
import { EmailServiceCore } from './email-service-core';
import { EmailServiceWorkflows } from './email-service-workflows';
import { EmailServiceUtils } from './email-service-utils';
import { EmailServiceBatch } from './email-service-batch';

export class EmailServiceV2 implements EmailServiceV2Interface {
  private core: EmailServiceCore;
  private workflows: EmailServiceWorkflows;
  private utils: EmailServiceUtils;
  private batch: EmailServiceBatch;

  constructor() {
    this.core = new EmailServiceCore();
    this.workflows = new EmailServiceWorkflows(this.core);
    this.utils = new EmailServiceUtils(this.core);
    this.batch = new EmailServiceBatch(this.core, this.workflows);
  }

  // =====================================================
  // CORE EMAIL SENDING (Delegated)
  // =====================================================

  async sendEmail(emailData: EmailData): Promise<boolean> {
    return await this.core.sendEmail(emailData);
  }

  // =====================================================
  // WORKFLOW METHODS (Delegated)
  // =====================================================

  async sendOrderConfirmation(orderId: string): Promise<boolean> {
    return await this.workflows.sendOrderConfirmation(orderId);
  }

  async sendOrderStatusUpdate(orderId: string, newStatus: string): Promise<boolean> {
    return await this.workflows.sendOrderStatusUpdate(orderId, newStatus);
  }

  async sendPaymentNotificationToAdmin(orderId: string): Promise<boolean> {
    return await this.workflows.sendPaymentNotificationToAdmin(orderId);
  }

  async sendReviewRequest(orderId: string): Promise<boolean> {
    return await this.workflows.sendReviewRequest(orderId);
  }

  // =====================================================
  // UTILITY METHODS (Delegated)
  // =====================================================

  async checkHealth(): Promise<{ status: string; details: any }> {
    return await this.utils.checkHealth();
  }

  async getEmailStats(days: number = 7): Promise<any> {
    return await this.utils.getEmailStats(days);
  }

  // =====================================================
  // EXTENDED FUNCTIONALITY (Delegated)
  // =====================================================

  async sendBulkEmails(emailDataList: EmailData[]): Promise<boolean[]> {
    return await this.batch.sendBulkEmails(emailDataList);
  }

  async sendScheduledEmails(orderId: string, scheduleType: 'confirmation' | 'reminder' | 'followup'): Promise<boolean> {
    return await this.batch.sendScheduledEmails(orderId, scheduleType);
  }

  async validateOrderExists(orderId: string): Promise<boolean> {
    return await this.batch.validateOrderExists(orderId);
  }

  async getBulkEmailHistory(orderIds: string[]): Promise<{ [orderId: string]: any[] }> {
    return await this.batch.getBulkEmailHistory(orderIds);
  }

  // =====================================================
  // SERVICE STATUS
  // =====================================================

  isInitialized(): boolean {
    return true; // Service is always initialized after constructor
  }

  async getServiceInfo(): Promise<{ version: string; status: string; features: string[] }> {
    return await this.utils.getServiceInfo();
  }
}

// Export singleton
export const emailService = new EmailServiceV2();
export default emailService;
