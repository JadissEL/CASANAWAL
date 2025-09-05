import { WorkflowTrigger } from './types';
import { defaultWorkflows } from './defaultWorkflows';
import { WorkflowDatabaseOperations } from './databaseOperations';

// =====================================================
// WORKFLOW MANAGEMENT (≤150 lines)
// =====================================================

export class WorkflowManager {
  private workflows: Map<string, WorkflowTrigger> = new Map();
  private dbOperations: WorkflowDatabaseOperations;

  constructor() {
    this.dbOperations = new WorkflowDatabaseOperations();
  }

  // =====================================================
  // DATABASE OPERATIONS
  // =====================================================

  async loadWorkflowsFromDatabase(): Promise<void> {
    this.workflows = await this.dbOperations.loadWorkflowsFromDatabase();
  }

  async setupDefaultWorkflows(): Promise<void> {
    for (const workflow of defaultWorkflows) {
      if (!this.workflows.has(workflow.event)) {
        await this.createWorkflow(workflow);
      }
    }
  }

  // =====================================================
  // WORKFLOW CRUD
  // =====================================================

  async createWorkflow(workflow: Omit<WorkflowTrigger, 'id'>): Promise<string> {
    const id = await this.dbOperations.createWorkflow(workflow);
    
    this.workflows.set(workflow.event, {
      ...workflow,
      id
    });

    return id;
  }

  async updateWorkflow(id: string, updates: Partial<WorkflowTrigger>): Promise<void> {
    await this.dbOperations.updateWorkflow(id, updates);
    await this.loadWorkflowsFromDatabase();
  }

  // =====================================================
  // WORKFLOW ACCESS
  // =====================================================

  getWorkflow(event: string): WorkflowTrigger | undefined {
    return this.workflows.get(event);
  }

  getAllWorkflows(): Map<string, WorkflowTrigger> {
    return this.workflows;
  }

  getWorkflowCount(): number {
    return this.workflows.size;
  }

  hasWorkflow(event: string): boolean {
    return this.workflows.has(event);
  }

  // =====================================================
  // INITIALIZATION
  // =====================================================

  async initialize(): Promise<void> {
    try {
      await this.loadWorkflowsFromDatabase();
      await this.setupDefaultWorkflows();
      console.log('✅ Workflow manager initialized');
    } catch (error) {
      console.error('❌ Failed to initialize workflow manager:', error);
      throw error;
    }
  }
}
