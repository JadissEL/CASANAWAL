// =====================================================
// EMAIL SERVICE V2 TYPE DEFINITIONS
// =====================================================

export interface EmailTemplate {
  id: string;
  code: string;
  name: string;
  subjectTemplate: string;
  htmlTemplate: string;
  textTemplate?: string;
  variables: string[];
}

export interface EmailData {
  templateCode: string;
  recipient: string;
  variables: Record<string, any>;
  orderId?: string;
  customerId?: string;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  scheduledAt?: Date;
}

export interface EmailLog {
  id: string;
  templateId: string;
  recipientEmail: string;
  subject: string;
  status: 'pending' | 'sent' | 'delivered' | 'failed' | 'bounced';
  sentAt?: Date;
  deliveredAt?: Date;
  openedAt?: Date;
  errorMessage?: string;
  orderId?: string;
  customerId?: string;
}

// =====================================================
// PROVIDER TYPES
// =====================================================

export interface EmailProviderConfig {
  type: 'smtp' | 'sendgrid' | 'mailgun' | 'development';
  host?: string;
  port?: number;
  secure?: boolean;
  auth?: {
    user: string;
    pass: string;
  };
  service?: string;
}

export interface EmailTransporterInfo {
  messageId: string;
  envelope?: any;
  accepted?: string[];
  rejected?: string[];
}

// =====================================================
// WORKFLOW TYPES
// =====================================================

export interface OrderData {
  id: string;
  order_number: string;
  reference_code: string;
  customer_name: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  customer_email?: string;
  phone?: string;
  customer_phone?: string;
  total_amount: number;
  deposit_amount?: number;
  remaining_amount?: number;
  preferred_delivery_date?: string;
  preferred_delivery_time?: string;
  customer_id?: string;
  delivered_at?: Date;
  estimated_delivery_at?: Date;
  status_name?: string;
  status_color?: string;
}

// =====================================================
// SERVICE INTERFACES
// =====================================================

export interface EmailServiceV2Interface {
  sendEmail(emailData: EmailData): Promise<boolean>;
  sendOrderConfirmation(orderId: string): Promise<boolean>;
  sendOrderStatusUpdate(orderId: string, newStatus: string): Promise<boolean>;
  sendPaymentNotificationToAdmin(orderId: string): Promise<boolean>;
  sendReviewRequest(orderId: string): Promise<boolean>;
  checkHealth(): Promise<{ status: string; details: any }>;
  getEmailStats(days?: number): Promise<any>;
}

export interface TemplateManagerInterface {
  getTemplate(code: string): Promise<EmailTemplate | null>;
  replaceVariables(template: string, variables: Record<string, any>): string;
}

export interface EmailLoggerInterface {
  createEmailLog(logData: Partial<EmailLog>): Promise<string>;
  updateEmailLog(logId: string, updates: Partial<EmailLog>): Promise<void>;
  getEmailStats(days: number): Promise<any>;
}
