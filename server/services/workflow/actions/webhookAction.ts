import { WorkflowAction, WorkflowEventData } from '../types';

// =====================================================
// WEBHOOK ACTION EXECUTOR
// =====================================================

export async function executeWebhookAction(
  action: WorkflowAction, 
  data: WorkflowEventData
): Promise<any> {
  const { url, method = 'POST', headers = {} } = action.config;
  
  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      body: JSON.stringify(data)
    });

    return {
      status: response.status,
      response: await response.text()
    };
  } catch (error) {
    throw new Error(`Webhook failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
