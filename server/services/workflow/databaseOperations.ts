import { db } from '../../database/connection';
import { WorkflowTrigger } from './types';

// =====================================================
// WORKFLOW DATABASE OPERATIONS (≤150 lines)
// =====================================================

export class WorkflowDatabaseOperations {
  // =====================================================
  // LOADING OPERATIONS
  // =====================================================

  async loadWorkflowsFromDatabase(): Promise<Map<string, WorkflowTrigger>> {
    const workflows = new Map<string, WorkflowTrigger>();
    
    try {
      const result = await db.query(`
        SELECT * FROM workflow_triggers 
        WHERE is_active = true 
        ORDER BY priority DESC
      `);

      for (const row of result.rows) {
        const workflow: WorkflowTrigger = {
          id: row.id,
          name: row.name,
          event: row.event,
          conditions: row.conditions || {},
          actions: row.actions || [],
          isActive: row.is_active,
          priority: row.priority || 0
        };
        
        workflows.set(row.event, workflow);
      }
    } catch (error) {
      console.error('Failed to load workflows from database:', error);
    }

    return workflows;
  }

  // =====================================================
  // CREATE OPERATIONS
  // =====================================================

  async createWorkflow(workflow: Omit<WorkflowTrigger, 'id'>): Promise<string> {
    try {
      const result = await db.query(`
        INSERT INTO workflow_triggers (
          name, event, conditions, actions, is_active, priority, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
        RETURNING id
      `, [
        workflow.name,
        workflow.event,
        JSON.stringify(workflow.conditions),
        JSON.stringify(workflow.actions),
        workflow.isActive,
        workflow.priority
      ]);

      const id = result.rows[0].id;
      console.log(`✅ Workflow created: ${workflow.name}`);
      return id;
    } catch (error) {
      console.error('Failed to create workflow:', error);
      throw error;
    }
  }

  // =====================================================
  // UPDATE OPERATIONS
  // =====================================================

  async updateWorkflow(id: string, updates: Partial<WorkflowTrigger>): Promise<void> {
    try {
      const { setClause, values } = this.buildUpdateQuery(id, updates);
      
      if (setClause.length > 0) {
        await db.query(
          `UPDATE workflow_triggers SET ${setClause.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
          values
        );
      }
    } catch (error) {
      console.error('Failed to update workflow:', error);
      throw error;
    }
  }

  private buildUpdateQuery(id: string, updates: Partial<WorkflowTrigger>) {
    const setClause: string[] = [];
    const values: any[] = [id];
    let paramIndex = 2;

    if (updates.name) {
      setClause.push(`name = $${paramIndex++}`);
      values.push(updates.name);
    }
    if (updates.conditions) {
      setClause.push(`conditions = $${paramIndex++}`);
      values.push(JSON.stringify(updates.conditions));
    }
    if (updates.actions) {
      setClause.push(`actions = $${paramIndex++}`);
      values.push(JSON.stringify(updates.actions));
    }
    if (updates.isActive !== undefined) {
      setClause.push(`is_active = $${paramIndex++}`);
      values.push(updates.isActive);
    }
    if (updates.priority !== undefined) {
      setClause.push(`priority = $${paramIndex++}`);
      values.push(updates.priority);
    }

    return { setClause, values };
  }

  // =====================================================
  // DELETE OPERATIONS
  // =====================================================

  async deleteWorkflow(id: string): Promise<void> {
    try {
      await db.query('UPDATE workflow_triggers SET is_active = false WHERE id = $1', [id]);
      console.log(`✅ Workflow deactivated: ${id}`);
    } catch (error) {
      console.error('Failed to delete workflow:', error);
      throw error;
    }
  }
}
