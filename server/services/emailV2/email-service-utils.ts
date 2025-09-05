// =====================================================
// EMAIL SERVICE UTILITY FUNCTIONS (≤150 lines)
// =====================================================

import { EmailServiceCore } from './email-service-core';

export class EmailServiceUtils {
  constructor(private core: EmailServiceCore) {}

  // =====================================================
  // HEALTH & MONITORING
  // =====================================================

  async checkHealth(): Promise<{ status: string; details: any }> {
    try {
      const providerManager = this.core.getProviderManager();
      const isHealthy = await providerManager.verifyConnection();
      
      return {
        status: isHealthy ? 'healthy' : 'unhealthy',
        details: {
          configured: providerManager.isServiceConfigured(),
          provider: process.env.EMAIL_PROVIDER || 'development',
          fromEmail: process.env.FROM_EMAIL || 'noreply@casanawal.ma'
        }
      };
    } catch (error) {
      const providerManager = this.core.getProviderManager();
      return {
        status: 'unhealthy',
        details: {
          error: error instanceof Error ? error.message : 'Unknown error',
          configured: providerManager.isServiceConfigured()
        }
      };
    }
  }

  async getEmailStats(days: number = 7): Promise<any> {
    const logger = this.core.getLogger();
    return await logger.getEmailStats(days);
  }

  // =====================================================
  // SERVICE INFORMATION
  // =====================================================

  async getServiceInfo(): Promise<{ 
    version: string; 
    status: string; 
    features: string[];
    configuration: any;
  }> {
    const health = await this.checkHealth();
    const providerManager = this.core.getProviderManager();
    
    return {
      version: '2.0.0',
      status: health.status,
      features: [
        'Template Management',
        'Email Logging',
        'Scheduled Emails',
        'Order Workflows',
        'Admin Notifications',
        'Bulk Operations',
        'Health Monitoring'
      ],
      configuration: {
        provider: process.env.EMAIL_PROVIDER || 'development',
        fromEmail: process.env.FROM_EMAIL || 'noreply@casanawal.ma',
        configured: providerManager.isServiceConfigured()
      }
    };
  }

  // =====================================================
  // VALIDATION & VERIFICATION
  // =====================================================

  async verifyEmailConfiguration(): Promise<{ 
    isValid: boolean; 
    errors: string[];
    warnings: string[];
  }> {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // Check environment variables
    if (!process.env.FROM_EMAIL) {
      warnings.push('FROM_EMAIL not set, using default');
    }
    
    if (!process.env.EMAIL_PROVIDER) {
      warnings.push('EMAIL_PROVIDER not set, using development mode');
    }
    
    // Check provider configuration
    const providerManager = this.core.getProviderManager();
    if (!providerManager.isServiceConfigured()) {
      warnings.push('Email provider not fully configured');
    }
    
    try {
      const isHealthy = await providerManager.verifyConnection();
      if (!isHealthy) {
        errors.push('Cannot connect to email provider');
      }
    } catch (error) {
      errors.push(`Connection test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  // Performance metrics moved to email-service-metrics.ts
}
