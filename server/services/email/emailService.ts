import nodemailer from 'nodemailer';
import { 
  OrderDetails, 
  EmailConfig, 
  MailOptions, 
  EmailTemplateData 
} from './types';
import { generateEmailTemplate } from './templates';
import { logEmailSent, logEmailFailed } from './logger';

// =====================================================
// MAIN EMAIL SERVICE
// =====================================================

class EmailService {
  private transporter: nodemailer.Transporter;
  
  constructor() {
    const emailConfig: EmailConfig = {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER || 'casanawal@gmail.com',
        pass: process.env.SMTP_PASS || 'your-app-password'
      }
    };
    
    this.transporter = nodemailer.createTransport(emailConfig);
  }
  
  /**
   * Email envoyé automatiquement après qu'un client passe une commande
   */
  async sendOrderConfirmationEmail(orderDetails: OrderDetails): Promise<boolean> {
    try {
      if (!orderDetails.client_email) {
        console.log('No email provided for order:', orderDetails.reference);
        return false;
      }
      
      const paymentLink = `${process.env.FRONTEND_URL || 'http://localhost:8080'}/payment/${orderDetails.reference}`;
      const depositAmount = Math.ceil(orderDetails.total_amount * 0.5);
      
      const templateData: EmailTemplateData = {
        orderDetails,
        paymentLink,
        depositAmount
      };
      
      const htmlContent = generateEmailTemplate('order_confirmation', templateData);
      
      const mailOptions: MailOptions = {
        from: `"CasaNawal" <${process.env.SMTP_USER}>`,
        to: orderDetails.client_email,
        subject: `✅ Commande reçue #${orderDetails.reference} - CasaNawal`,
        html: htmlContent
      };
      
      await this.transporter.sendMail(mailOptions);
      await logEmailSent(orderDetails.client_email, mailOptions.subject, 'ORDER_CONFIRMATION', orderDetails.id);
      
      console.log(`Order confirmation email sent to ${orderDetails.client_email} for order ${orderDetails.reference}`);
      return true;
    } catch (error) {
      console.error('Error sending order confirmation email:', error);
      
      if (orderDetails.client_email) {
        await logEmailFailed(
          orderDetails.client_email, 
          `Order confirmation #${orderDetails.reference}`, 
          'ORDER_CONFIRMATION', 
          orderDetails.id, 
          error instanceof Error ? error.message : 'Unknown error'
        );
      }
      
      return false;
    }
  }
  
  /**
   * Email envoyé quand l'admin confirme la commande
   */
  async sendOrderValidatedEmail(orderDetails: OrderDetails): Promise<boolean> {
    try {
      if (!orderDetails.client_email) {
        console.log('No email provided for order:', orderDetails.reference);
        return false;
      }
      
      const remainingAmount = orderDetails.total_amount - (orderDetails.total_amount * 0.5);
      
      const templateData: EmailTemplateData = {
        orderDetails,
        remainingAmount
      };
      
      const htmlContent = generateEmailTemplate('order_validated', templateData);
      
      const mailOptions: MailOptions = {
        from: `"CasaNawal" <${process.env.SMTP_USER}>`,
        to: orderDetails.client_email,
        subject: `🎉 Commande confirmée #${orderDetails.reference} - Préparation en cours !`,
        html: htmlContent
      };
      
      await this.transporter.sendMail(mailOptions);
      await logEmailSent(orderDetails.client_email, mailOptions.subject, 'ORDER_VALIDATED', orderDetails.id);
      
      console.log(`Order validation email sent to ${orderDetails.client_email} for order ${orderDetails.reference}`);
      return true;
    } catch (error) {
      console.error('Error sending order validation email:', error);
      
      if (orderDetails.client_email) {
        await logEmailFailed(
          orderDetails.client_email, 
          `Order validation #${orderDetails.reference}`, 
          'ORDER_VALIDATED', 
          orderDetails.id, 
          error instanceof Error ? error.message : 'Unknown error'
        );
      }
      
      return false;
    }
  }
  
  /**
   * Email pour demander un nouveau reçu de paiement
   */
  async sendReceiptRequestEmail(orderDetails: OrderDetails, reason: string): Promise<boolean> {
    try {
      if (!orderDetails.client_email) {
        console.log('No email provided for order:', orderDetails.reference);
        return false;
      }
      
      const paymentLink = `${process.env.FRONTEND_URL || 'http://localhost:8080'}/payment/${orderDetails.reference}`;
      
      const templateData: EmailTemplateData = {
        orderDetails,
        paymentLink,
        reason
      };
      
      const htmlContent = generateEmailTemplate('receipt_request', templateData);
      
      const mailOptions: MailOptions = {
        from: `"CasaNawal" <${process.env.SMTP_USER}>`,
        to: orderDetails.client_email,
        subject: `⚠️ Nouveau justificatif requis #${orderDetails.reference} - CasaNawal`,
        html: htmlContent
      };
      
      await this.transporter.sendMail(mailOptions);
      await logEmailSent(orderDetails.client_email, mailOptions.subject, 'RECEIPT_REQUEST', orderDetails.id);
      
      console.log(`Receipt request email sent to ${orderDetails.client_email} for order ${orderDetails.reference}`);
      return true;
    } catch (error) {
      console.error('Error sending receipt request email:', error);
      
      if (orderDetails.client_email) {
        await logEmailFailed(
          orderDetails.client_email, 
          `Receipt request #${orderDetails.reference}`, 
          'RECEIPT_REQUEST', 
          orderDetails.id, 
          error instanceof Error ? error.message : 'Unknown error'
        );
      }
      
      return false;
    }
  }
}

// Export singleton
export const emailService = new EmailService();
export default emailService;
