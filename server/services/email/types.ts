// =====================================================
// EMAIL SERVICE TYPE DEFINITIONS
// =====================================================

export interface OrderDetails {
  id: string;
  reference: string;
  client_phone: string;
  client_name: string;
  client_email?: string;
  delivery_address: string;
  delivery_time: string;
  total_amount: number;
  payment_status: string;
  status: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  created_at: string;
}

export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export interface MailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
}

export interface EmailLog {
  recipient: string;
  subject: string;
  type: string;
  order_id: string;
  status: 'sent' | 'failed';
  error_message?: string;
}

// =====================================================
// EMAIL TEMPLATE TYPES
// =====================================================

export interface EmailTemplateData {
  orderDetails: OrderDetails;
  paymentLink?: string;
  depositAmount?: number;
  remainingAmount?: number;
  reason?: string;
}

export type EmailTemplateFunction = (data: EmailTemplateData) => string;

// =====================================================
// EMAIL SERVICE METHODS
// =====================================================

export interface EmailServiceInterface {
  sendOrderConfirmationEmail(orderDetails: OrderDetails): Promise<boolean>;
  sendOrderValidatedEmail(orderDetails: OrderDetails): Promise<boolean>;
  sendReceiptRequestEmail(orderDetails: OrderDetails, reason: string): Promise<boolean>;
}
