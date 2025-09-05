import { WorkflowAction, WorkflowEventData } from '../types';

// =====================================================
// SMS ACTION EXECUTOR
// =====================================================

export async function executeSmsAction(
  action: WorkflowAction, 
  data: WorkflowEventData
): Promise<any> {
  // Implémentation SMS (Twilio, etc.)
  console.log('SMS action not implemented yet:', action);
  return { status: 'sms_not_implemented' };
}
