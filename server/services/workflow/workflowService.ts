import { WorkflowTrigger } from './types';
import { WorkflowManager } from './workflowManager';
import { EventTrigger } from './eventTrigger';
import { 
  getWorkflowStats, 
  getRecentExecutions, 
  checkWorkflowHealth 
} from './monitoring';

// =====================================================
// MAIN WORKFLOW SERVICE (≤150 lines)
// =====================================================

class WorkflowService {
  private workflowManager: WorkflowManager;
  private eventTrigger: EventTrigger;
  private isInitialized = false;

  constructor() {
    this.workflowManager = new WorkflowManager();
    this.eventTrigger = new EventTrigger(this.workflowManager);
    this.initializeWorkflows();
  }

  private async initializeWorkflows() {
    try {
      await this.workflowManager.initialize();
      this.isInitialized = true;
      this.eventTrigger.setInitialized(true);
      console.log('✅ Workflow service initialized');
    } catch (error) {
      console.error('❌ Failed to initialize workflow service:', error);
    }
  }

  // =====================================================
  // WORKFLOW MANAGEMENT (Delegated)
  // =====================================================

  async createWorkflow(workflow: Omit<WorkflowTrigger, 'id'>): Promise<string> {
    return await this.workflowManager.createWorkflow(workflow);
  }

  async updateWorkflow(id: string, updates: Partial<WorkflowTrigger>): Promise<void> {
    return await this.workflowManager.updateWorkflow(id, updates);
  }

  // =====================================================
  // EVENT TRIGGERING (Delegated)
  // =====================================================

  async triggerEvent(event: string, data: any): Promise<void> {
    return await this.eventTrigger.triggerEvent(event, data);
  }

  async onOrderCreated(orderId: string, orderData: any): Promise<void> {
    return await this.eventTrigger.onOrderCreated(orderId, orderData);
  }

  async onOrderStatusChanged(orderId: string, oldStatus: string, newStatus: string, orderData: any): Promise<void> {
    return await this.eventTrigger.onOrderStatusChanged(orderId, oldStatus, newStatus, orderData);
  }

  async onPaymentProofUploaded(orderId: string, paymentData: any): Promise<void> {
    return await this.eventTrigger.onPaymentProofUploaded(orderId, paymentData);
  }

  async onOrderDelivered(orderId: string, orderData: any): Promise<void> {
    return await this.eventTrigger.onOrderDelivered(orderId, orderData);
  }

  async onLowStock(productId: string, currentStock: number): Promise<void> {
    return await this.eventTrigger.onLowStock(productId, currentStock);
  }

  // =====================================================
  // MONITORING METHODS (Delegated)
  // =====================================================

  async getWorkflowStats(days: number = 7): Promise<any> {
    return await getWorkflowStats(days);
  }

  async getRecentExecutions(limit: number = 50): Promise<any> {
    return await getRecentExecutions(limit);
  }

  async checkHealth(): Promise<{ status: string; details: any }> {
    return await checkWorkflowHealth(this.workflowManager.getWorkflowCount(), this.isInitialized);
  }

  // =====================================================
  // UTILITY METHODS
  // =====================================================

  getWorkflowCount(): number {
    return this.workflowManager.getWorkflowCount();
  }

  isServiceInitialized(): boolean {
    return this.isInitialized;
  }
}

// Export singleton
export const workflowService = new WorkflowService();
export default workflowService;
