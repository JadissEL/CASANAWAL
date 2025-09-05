// =====================================================
// EMAIL SCHEDULER SERVICE
// =====================================================

import nodemailer from 'nodemailer';
import { EmailLogger } from './logger';

export class EmailScheduler {
  constructor(
    private transporter: nodemailer.Transporter,
    private logger: EmailLogger
  ) {}

  async scheduleEmail(
    logId: string, 
    mailOptions: any, 
    scheduledAt: Date
  ): Promise<void> {
    // Ici on pourrait utiliser un système de queue comme Bull Queue avec Redis
    // Pour la simplicité, on utilise setTimeout pour la démo
    const delay = scheduledAt.getTime() - Date.now();
    
    if (delay > 0) {
      setTimeout(async () => {
        try {
          const info = await this.transporter.sendMail(mailOptions);
          await this.logger.updateEmailLog(logId, {
            status: 'sent',
            sentAt: new Date(),
            providerMessageId: info.messageId
          });
          
          console.log(`📅 Scheduled email sent successfully: ${mailOptions.to}`);
        } catch (error) {
          await this.logger.updateEmailLog(logId, {
            status: 'failed',
            errorMessage: error instanceof Error ? error.message : 'Scheduled send failed'
          });
          
          console.error('❌ Scheduled email failed:', error);
        }
      }, delay);
      
      console.log(`📅 Email scheduled for ${scheduledAt.toISOString()}`);
    } else {
      console.warn('⚠️ Scheduled time is in the past, email not scheduled');
    }
  }

  getPriorityValue(priority: string): string {
    const priorities = {
      low: '5',
      normal: '3',
      high: '2',
      urgent: '1'
    };
    return priorities[priority as keyof typeof priorities] || '3';
  }
}
