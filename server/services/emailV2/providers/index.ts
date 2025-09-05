// =====================================================
// EMAIL PROVIDER CONFIGURATIONS
// =====================================================

import nodemailer from 'nodemailer';
import { EmailProviderConfig } from '../types';

export class EmailProviderManager {
  private transporter: nodemailer.Transporter | null = null;
  private isConfigured: boolean = false;

  constructor(private defaultFrom: string) {}

  async setupTransporter(): Promise<void> {
    try {
      const providerType = process.env.EMAIL_PROVIDER as EmailProviderConfig['type'];
      
      switch (providerType) {
        case 'smtp':
          this.transporter = this.createSmtpTransporter();
          break;
        case 'sendgrid':
          this.transporter = this.createSendGridTransporter();
          break;
        case 'mailgun':
          this.transporter = this.createMailgunTransporter();
          break;
        default:
          await this.setupDevelopmentTransporter();
          return;
      }

      this.isConfigured = true;
      console.log('✅ Email service configured successfully');
    } catch (error) {
      console.error('❌ Email service configuration failed:', error);
      await this.setupDevelopmentTransporter();
    }
  }

  private createSmtpTransporter(): nodemailer.Transporter {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  private createSendGridTransporter(): nodemailer.Transporter {
    return nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY,
      },
    });
  }

  private createMailgunTransporter(): nodemailer.Transporter {
    return nodemailer.createTransport({
      service: 'Mailgun',
      auth: {
        user: process.env.MAILGUN_USERNAME,
        pass: process.env.MAILGUN_PASSWORD,
      },
    });
  }

  private async setupDevelopmentTransporter(): Promise<void> {
    try {
      const testAccount = await nodemailer.createTestAccount();
      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      console.log('🔧 Email service configured for development (Ethereal Email)');
      console.log(`📧 Test account: ${testAccount.user}`);
    } catch (error) {
      console.error('❌ Failed to create development email account:', error);
    }
  }

  getTransporter(): nodemailer.Transporter | null {
    return this.transporter;
  }

  isServiceConfigured(): boolean {
    return this.isConfigured;
  }

  async verifyConnection(): Promise<boolean> {
    if (!this.transporter) return false;
    
    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      return false;
    }
  }
}
