import { WorkflowEventData } from './types';
import { checkConditions } from './utils';
import { WorkflowManager } from './workflowManager';
import { ExecutionManager } from './executionManager';

// =====================================================
// EVENT TRIGGERING (≤150 lines)
// =====================================================

export class EventTrigger {
  private isInitialized = false;
  private executionManager: ExecutionManager;

  constructor(private workflowManager: WorkflowManager) {
    this.executionManager = new ExecutionManager();
  }

  setInitialized(initialized: boolean): void {
    this.isInitialized = initialized;
  }

  // =====================================================
  // EVENT TRIGGERING
  // =====================================================

  async triggerEvent(event: string, data: WorkflowEventData): Promise<void> {
    if (!this.isInitialized) {
      console.warn('Workflow service not initialized, skipping event:', event);
      return;
    }

    try {
      const workflow = this.workflowManager.getWorkflow(event);
      if (!workflow || !workflow.isActive) {
        console.log(`No active workflow found for event: ${event}`);
        return;
      }

      if (!checkConditions(workflow.conditions, data)) {
        console.log(`Workflow conditions not met for event: ${event}`);
        return;
      }

      const executionId = await this.executionManager.createExecution(workflow.id, data);
      await this.executionManager.executeActions(executionId, workflow.actions, data);

    } catch (error) {
      console.error(`Failed to trigger workflow for event ${event}:`, error);
    }
  }

  // =====================================================
  // PUBLIC EVENT TRIGGERS
  // =====================================================

  async onOrderCreated(orderId: string, orderData: any): Promise<void> {
    await this.triggerEvent('order.created', {
      entityType: 'order',
      entityId: orderId,
      orderId,
      ...orderData
    });
  }

  async onOrderStatusChanged(orderId: string, oldStatus: string, newStatus: string, orderData: any): Promise<void> {
    await this.triggerEvent('order.status_changed', {
      entityType: 'order',
      entityId: orderId,
      orderId,
      oldStatus,
      newStatus,
      ...orderData
    });
  }

  async onPaymentProofUploaded(orderId: string, paymentData: any): Promise<void> {
    await this.triggerEvent('payment.proof_uploaded', {
      entityType: 'payment',
      entityId: paymentData.id,
      orderId,
      ...paymentData
    });
  }

  async onOrderDelivered(orderId: string, orderData: any): Promise<void> {
    await this.triggerEvent('order.delivered', {
      entityType: 'order',
      entityId: orderId,
      orderId,
      ...orderData
    });
  }

  async onLowStock(productId: string, currentStock: number): Promise<void> {
    await this.triggerEvent('product.low_stock', {
      entityType: 'product',
      entityId: productId,
      productId,
      currentStock
    });
  }
}
