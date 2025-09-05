import { db } from '../../../database/connection';
import { WorkflowAction, WorkflowEventData } from '../types';

// =====================================================
// DATABASE UPDATE ACTION EXECUTOR
// =====================================================

export async function executeDatabaseUpdateAction(
  action: WorkflowAction, 
  data: WorkflowEventData
): Promise<any> {
  const { table, where, updates } = action.config;
  
  // Construire la requête UPDATE
  const setClause = Object.keys(updates).map((key, index) => `${key} = $${index + 1}`).join(', ');
  const whereClause = Object.keys(where).map((key, index) => `${key} = $${index + Object.keys(updates).length + 1}`).join(' AND ');
  
  const values = [...Object.values(updates), ...Object.values(where)];
  
  const query = `UPDATE ${table} SET ${setClause} WHERE ${whereClause}`;
  
  const result = await db.query(query, values);
  
  return { rowsAffected: result.rowCount };
}
