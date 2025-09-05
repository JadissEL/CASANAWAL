// =====================================================
// EMAIL SERVICE WORKFLOW METHODS (≤150 lines)
// =====================================================

import { EmailServiceCore } from './email-service-core';
import { OrderWorkflows } from './workflows/orderWorkflows';
import { AdminWorkflows } from './workflows/adminWorkflows';

export class EmailServiceWorkflows {
  private core: EmailServiceCore;
  private orderWorkflows: OrderWorkflows;
  private adminWorkflows: AdminWorkflows;

  constructor(core: EmailServiceCore) {
    this.core = core;
    this.orderWorkflows = new OrderWorkflows();
    this.adminWorkflows = new AdminWorkflows();
  }

  // =====================================================
  // ORDER WORKFLOW METHODS
  // =====================================================

  async sendOrderConfirmation(orderId: string): Promise<boolean> {
    try {
      const order = await this.orderWorkflows.getOrderData(orderId);
      if (!order) {
        throw new Error('Order not found');
      }

      const emailData = this.orderWorkflows.prepareOrderConfirmationData(order);
      if (!emailData) {
        return false;
      }

      return await this.core.sendEmail(emailData);
    } catch (error) {
      console.error('Failed to send order confirmation:', error);
      return false;
    }
  }

  async sendOrderStatusUpdate(orderId: string, newStatus: string): Promise<boolean> {
    try {
      const order = await this.orderWorkflows.getOrderData(orderId);
      if (!order) {
        throw new Error('Order not found');
      }

      const emailData = this.orderWorkflows.prepareOrderStatusUpdateData(order, newStatus);
      if (!emailData) {
        return false;
      }

      return await this.core.sendEmail(emailData);
    } catch (error) {
      console.error('Failed to send status update:', error);
      return false;
    }
  }

  async sendReviewRequest(orderId: string): Promise<boolean> {
    try {
      const order = await this.orderWorkflows.getOrderData(orderId);
      if (!order) {
        throw new Error('Order not found or not delivered');
      }

      const emailData = this.orderWorkflows.prepareReviewRequestData(order);
      if (!emailData) {
        return false;
      }

      return await this.core.sendEmail(emailData);
    } catch (error) {
      console.error('Failed to send review request:', error);
      return false;
    }
  }

  // =====================================================
  // ADMIN WORKFLOW METHODS
  // =====================================================

  async sendPaymentNotificationToAdmin(orderId: string): Promise<boolean> {
    try {
      const adminEmails = await this.adminWorkflows.getAdminEmails();
      if (adminEmails.length === 0) {
        console.log('No admin emails configured');
        return false;
      }

      const order = await this.orderWorkflows.getOrderData(orderId);
      if (!order) {
        throw new Error('Order not found');
      }

      const emailTemplates = this.adminWorkflows.preparePaymentNotificationData(order);
      
      // Envoyer à tous les admins
      const promises = adminEmails.map(email => {
        const emailData = { ...emailTemplates[0], recipient: email };
        return this.core.sendEmail(emailData);
      });

      const results = await Promise.all(promises);
      return results.some(result => result);
    } catch (error) {
      console.error('Failed to send admin payment notification:', error);
      return false;
    }
  }

  // Batch operations and utilities moved to email-service-batch.ts
}
