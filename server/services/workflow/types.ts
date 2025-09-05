// =====================================================
// WORKFLOW TYPE DEFINITIONS
// =====================================================

export interface WorkflowTrigger {
  id: string;
  name: string;
  event: string;
  conditions: Record<string, any>;
  actions: WorkflowAction[];
  isActive: boolean;
  priority: number;
}

export interface WorkflowAction {
  type: 'email' | 'sms' | 'webhook' | 'database_update' | 'notification';
  config: Record<string, any>;
  delay?: number; // délai en minutes
  conditions?: Record<string, any>;
}

export interface WorkflowExecution {
  id: string;
  triggerId: string;
  entityType: string;
  entityId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  startedAt: Date;
  completedAt?: Date;
  errorMessage?: string;
  executedActions: WorkflowActionExecution[];
}

export interface WorkflowActionExecution {
  actionType: string;
  status: 'pending' | 'completed' | 'failed' | 'skipped';
  executedAt?: Date;
  result?: any;
  errorMessage?: string;
}

// =====================================================
// EVENT DATA TYPES
// =====================================================

export interface OrderEventData {
  entityType: 'order';
  entityId: string;
  orderId: string;
  customer_email?: string;
  customerId?: string;
  [key: string]: any;
}

export interface PaymentEventData {
  entityType: 'payment';
  entityId: string;
  orderId: string;
  [key: string]: any;
}

export interface ProductEventData {
  entityType: 'product';
  entityId: string;
  productId: string;
  currentStock: number;
  [key: string]: any;
}

export type WorkflowEventData = OrderEventData | PaymentEventData | ProductEventData;

// =====================================================
// CONDITION TYPES
// =====================================================

export interface ComplexCondition {
  gte?: number;
  lte?: number;
  in?: any[];
  not?: any;
}

export type ConditionValue = any | ComplexCondition;

// =====================================================
// ACTION CONFIG TYPES
// =====================================================

export interface EmailActionConfig {
  template: string;
  to: 'customer' | 'admins' | string;
}

export interface NotificationActionConfig {
  type: 'admin';
  message: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface WebhookActionConfig {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
}

export interface DatabaseUpdateActionConfig {
  table: string;
  where: Record<string, any>;
  updates: Record<string, any>;
}
