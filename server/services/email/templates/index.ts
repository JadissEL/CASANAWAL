// =====================================================
// EMAIL TEMPLATES INDEX
// =====================================================

export { generateOrderConfirmationTemplate } from './orderConfirmation';
export { generateOrderValidatedTemplate } from './orderValidated';
export { generateReceiptRequestTemplate } from './receiptRequest';

// =====================================================
// TEMPLATE MAPPER
// =====================================================

import { generateOrderConfirmationTemplate } from './orderConfirmation';
import { generateOrderValidatedTemplate } from './orderValidated';
import { generateReceiptRequestTemplate } from './receiptRequest';
import { EmailTemplateData, EmailTemplateFunction } from '../types';

export const emailTemplates: Record<string, EmailTemplateFunction> = {
  order_confirmation: generateOrderConfirmationTemplate,
  order_validated: generateOrderValidatedTemplate,
  receipt_request: generateReceiptRequestTemplate,
} as const;

export function generateEmailTemplate(
  templateName: string, 
  data: EmailTemplateData
): string {
  const template = emailTemplates[templateName];
  
  if (!template) {
    throw new Error(`Unknown email template: ${templateName}`);
  }
  
  return template(data);
}
