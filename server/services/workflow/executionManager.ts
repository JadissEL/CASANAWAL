import { db } from '../../database/connection';
import { WorkflowAction, WorkflowEventData } from './types';
import { executeAction } from './actions';
import { checkConditions, logActionExecution } from './utils';

// =====================================================
// WORKFLOW EXECUTION MANAGER (≤150 lines)
// =====================================================

export class ExecutionManager {
  // =====================================================
  // EXECUTION CREATION
  // =====================================================

  async createExecution(triggerId: string, data: WorkflowEventData): Promise<string> {
    const result = await db.query(`
      INSERT INTO workflow_executions (
        trigger_id, entity_type, entity_id, status, started_at, context_data
      ) VALUES ($1, $2, $3, 'pending', CURRENT_TIMESTAMP, $4)
      RETURNING id
    `, [
      triggerId,
      data.entityType || 'unknown',
      data.entityId || null,
      JSON.stringify(data)
    ]);

    return result.rows[0].id;
  }

  // =====================================================
  // ACTION EXECUTION
  // =====================================================

  async executeActions(
    executionId: string, 
    actions: WorkflowAction[], 
    data: WorkflowEventData
  ): Promise<void> {
    try {
      await this.updateExecutionStatus(executionId, 'running');

      for (const action of actions) {
        await this.processAction(executionId, action, data);
      }

      await this.updateExecutionStatus(executionId, 'completed');
    } catch (error) {
      await this.updateExecutionStatus(executionId, 'failed', error);
      throw error;
    }
  }

  private async processAction(
    executionId: string, 
    action: WorkflowAction, 
    data: WorkflowEventData
  ): Promise<void> {
    try {
      if (action.conditions && !checkConditions(action.conditions, data)) {
        await logActionExecution(db, executionId, action, 'skipped', null, 'Conditions not met');
        return;
      }

      if (action.delay && action.delay > 0) {
        this.scheduleAction(executionId, action, data);
        await logActionExecution(db, executionId, action, 'pending', null, `Scheduled for ${action.delay} minutes`);
      } else {
        const result = await this.executeAction(executionId, action, data);
        await logActionExecution(db, executionId, action, 'completed', result);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      await logActionExecution(db, executionId, action, 'failed', null, errorMessage);
      console.error(`Action execution failed:`, error);
    }
  }

  private scheduleAction(executionId: string, action: WorkflowAction, data: WorkflowEventData): void {
    setTimeout(() => this.executeAction(executionId, action, data), action.delay! * 60 * 1000);
  }

  private async executeAction(executionId: string, action: WorkflowAction, data: WorkflowEventData): Promise<any> {
    return await executeAction(action, data);
  }

  // =====================================================
  // EXECUTION STATUS UPDATES
  // =====================================================

  private async updateExecutionStatus(
    executionId: string, 
    status: 'running' | 'completed' | 'failed',
    error?: any
  ): Promise<void> {
    if (status === 'running') {
      await db.query(
        'UPDATE workflow_executions SET status = $1 WHERE id = $2',
        [status, executionId]
      );
    } else if (status === 'completed') {
      await db.query(
        'UPDATE workflow_executions SET status = $1, completed_at = CURRENT_TIMESTAMP WHERE id = $2',
        [status, executionId]
      );
    } else if (status === 'failed') {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      await db.query(
        'UPDATE workflow_executions SET status = $1, error_message = $2, completed_at = CURRENT_TIMESTAMP WHERE id = $3',
        [status, errorMessage, executionId]
      );
    }
  }
}
