// =====================================================
// ACTION EXECUTORS INDEX
// =====================================================

export { executeEmailAction } from './emailAction';
export { executeNotificationAction } from './notificationAction';
export { executeWebhookAction } from './webhookAction';
export { executeDatabaseUpdateAction } from './databaseAction';
export { executeSmsAction } from './smsAction';

// =====================================================
// ACTION EXECUTOR MAPPER
// =====================================================

import { executeEmailAction } from './emailAction';
import { executeNotificationAction } from './notificationAction';
import { executeWebhookAction } from './webhookAction';
import { executeDatabaseUpdateAction } from './databaseAction';
import { executeSmsAction } from './smsAction';
import { WorkflowAction, WorkflowEventData } from '../types';

export const actionExecutors = {
  email: executeEmailAction,
  notification: executeNotificationAction,
  webhook: executeWebhookAction,
  database_update: executeDatabaseUpdateAction,
  sms: executeSmsAction,
} as const;

export async function executeAction(
  action: WorkflowAction, 
  data: WorkflowEventData
): Promise<any> {
  const executor = actionExecutors[action.type];
  
  if (!executor) {
    throw new Error(`Unknown action type: ${action.type}`);
  }
  
  return await executor(action, data);
}
