import { ComplexCondition, ConditionValue } from './types';

// =====================================================
// WORKFLOW UTILITY FUNCTIONS
// =====================================================

export function checkConditions(
  conditions: Record<string, any>, 
  data: Record<string, any>
): boolean {
  for (const [key, expectedValue] of Object.entries(conditions)) {
    const actualValue = getNestedValue(data, key);
    
    if (typeof expectedValue === 'object' && expectedValue !== null) {
      // Conditions complexes (ex: { gte: 10 }, { in: ['a', 'b'] })
      if (expectedValue.gte !== undefined && actualValue < expectedValue.gte) return false;
      if (expectedValue.lte !== undefined && actualValue > expectedValue.lte) return false;
      if (expectedValue.in !== undefined && !expectedValue.in.includes(actualValue)) return false;
      if (expectedValue.not !== undefined && actualValue === expectedValue.not) return false;
    } else {
      // Condition simple d'égalité
      if (actualValue !== expectedValue) return false;
    }
  }
  
  return true;
}

export function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

export function logActionExecution(
  db: any,
  executionId: string,
  action: any,
  status: string,
  result?: any,
  errorMessage?: string
): Promise<void> {
  return db.query(`
    INSERT INTO workflow_action_executions (
      execution_id, action_type, status, executed_at, result, error_message
    ) VALUES ($1, $2, $3, CURRENT_TIMESTAMP, $4, $5)
  `, [
    executionId,
    action.type,
    status,
    result ? JSON.stringify(result) : null,
    errorMessage
  ]);
}
