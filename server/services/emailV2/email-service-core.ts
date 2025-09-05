// =====================================================
// EMAIL SERVICE CORE FUNCTIONALITY (≤150 lines)
// =====================================================

import nodemailer from 'nodemailer';
import { EmailData } from './types';
import { EmailProviderManager } from './providers';
import { TemplateManager } from './templates/templateManager';
import { EmailLogger } from './logger';
import { EmailScheduler } from './scheduler';

export class EmailServiceCore {
  private providerManager: EmailProviderManager;
  private templateManager: TemplateManager;
  private logger: EmailLogger;
  private scheduler: EmailScheduler | null = null;
  private defaultFrom: string;

  constructor() {
    this.defaultFrom = process.env.FROM_EMAIL || 'noreply@casanawal.ma';
    this.providerManager = new EmailProviderManager(this.defaultFrom);
    this.templateManager = new TemplateManager();
    this.logger = new EmailLogger();
    
    this.initialize();
  }

  private async initialize(): Promise<void> {
    await this.providerManager.setupTransporter();
    const transporter = this.providerManager.getTransporter();
    
    if (transporter) {
      this.scheduler = new EmailScheduler(transporter, this.logger);
    }
  }

  // =====================================================
  // CORE EMAIL SENDING
  // =====================================================

  async sendEmail(emailData: EmailData): Promise<boolean> {
    try {
      const transporter = this.providerManager.getTransporter();
      if (!transporter) {
        throw new Error('Email transporter not configured');
      }

      // Récupérer le template
      const template = await this.templateManager.getTemplate(emailData.templateCode);
      if (!template) {
        throw new Error(`Template not found: ${emailData.templateCode}`);
      }

      // Remplacer les variables
      const subject = this.templateManager.replaceVariables(template.subjectTemplate, emailData.variables);
      const htmlContent = this.templateManager.replaceVariables(template.htmlTemplate, emailData.variables);
      const textContent = template.textTemplate 
        ? this.templateManager.replaceVariables(template.textTemplate, emailData.variables)
        : this.templateManager.htmlToText(htmlContent);

      // Créer le log avant envoi
      const logId = await this.logger.createEmailLog({
        templateId: template.id,
        recipientEmail: emailData.recipient,
        subject,
        orderId: emailData.orderId,
        customerId: emailData.customerId,
        status: 'pending'
      });

      // Configuration de l'email
      const mailOptions = {
        from: this.defaultFrom,
        to: emailData.recipient,
        subject,
        html: htmlContent,
        text: textContent,
        headers: {
          'X-Email-Log-ID': logId,
          'X-Priority': this.scheduler?.getPriorityValue(emailData.priority || 'normal') || '3'
        }
      };

      // Envoi différé si nécessaire
      if (emailData.scheduledAt && emailData.scheduledAt > new Date() && this.scheduler) {
        await this.scheduler.scheduleEmail(logId, mailOptions, emailData.scheduledAt);
        return true;
      }

      // Envoi immédiat
      const info = await transporter.sendMail(mailOptions);
      
      // Mettre à jour le log
      await this.logger.updateEmailLog(logId, {
        status: 'sent',
        sentAt: new Date(),
        providerMessageId: info.messageId
      });

      // En développement, afficher le lien de prévisualisation
      if (!this.providerManager.isServiceConfigured() && info.envelope) {
        console.log('📧 Email sent in development mode');
        console.log('🔗 Preview URL:', nodemailer.getTestMessageUrl(info));
      }

      console.log(`✅ Email sent successfully to ${emailData.recipient}`);
      return true;

    } catch (error) {
      console.error('❌ Failed to send email:', error);
      
      // Mettre à jour le log en cas d'erreur
      if (emailData.templateCode) {
        const template = await this.templateManager.getTemplate(emailData.templateCode);
        if (template) {
          await this.logger.createEmailLog({
            templateId: template.id,
            recipientEmail: emailData.recipient,
            subject: 'Failed to process',
            status: 'failed',
            errorMessage: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }
      
      return false;
    }
  }

  // Utility methods moved to email-service-utils.ts
  // Expose internal components for workflow usage
  getTemplateManager(): TemplateManager {
    return this.templateManager;
  }

  getLogger(): EmailLogger {
    return this.logger;
  }

  getProviderManager(): EmailProviderManager {
    return this.providerManager;
  }

  getScheduler(): EmailScheduler | null {
    return this.scheduler;
  }
}
