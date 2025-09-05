# Email Service V2 Refactoring Documentation

## 📁 **New Modular Structure**

The advanced email service has been refactored from a monolithic 649-line file into a modular, maintainable structure:

```
server/services/emailV2/
├── types.ts                    # Type definitions (100 lines)
├── emailService.ts             # Main service (147 lines)
├── logger.ts                   # Email logging functionality (96 lines)
├── scheduler.ts                # Email scheduling (52 lines)
├── providers/
│   └── index.ts                # Email provider configurations (87 lines)
├── templates/
│   └── templateManager.ts      # Template management (58 lines)
└── workflows/
    ├── orderWorkflows.ts       # Order email workflows (143 lines)
    └── adminWorkflows.ts       # Admin email workflows (65 lines)
```

## 🎯 **Refactoring Benefits**

### **File Size Reduction**
- **Before**: 649 lines (monolithic)
- **After**: 8 focused files, all under 150 lines
- **Main Service**: Reduced from 649 to 147 lines (77% reduction)

### **Separation of Concerns**
- **Types**: Centralized type definitions and interfaces
- **Providers**: Email provider configurations (SMTP, SendGrid, Mailgun)
- **Templates**: Database-driven template management
- **Logging**: Comprehensive email logging and analytics
- **Scheduling**: Email scheduling and priority handling
- **Workflows**: Business logic for different email types
- **Service**: Core orchestration and public API

### **Maintainability Improvements**
- **Easy to Find**: Specific functionality in dedicated files
- **Easy to Modify**: Change providers or workflows without touching main service
- **Easy to Test**: Individual components can be tested separately
- **Easy to Extend**: Add new providers, workflows, or features

## 🔧 **Module Details**

### **1. Types (`types.ts`)**
```typescript
// Core interfaces
export interface EmailTemplate { ... }
export interface EmailData { ... }
export interface EmailLog { ... }

// Provider types
export interface EmailProviderConfig { ... }
export interface EmailTransporterInfo { ... }

// Workflow types
export interface OrderData { ... }

// Service interfaces
export interface EmailServiceV2Interface { ... }
export interface TemplateManagerInterface { ... }
export interface EmailLoggerInterface { ... }
```

### **2. Providers (`providers/index.ts`)**
Email provider management with support for:
- **SMTP**: Generic SMTP configuration
- **SendGrid**: SendGrid API integration
- **Mailgun**: Mailgun API integration
- **Development**: Ethereal Email for testing

```typescript
export class EmailProviderManager {
  async setupTransporter(): Promise<void>
  getTransporter(): nodemailer.Transporter | null
  isServiceConfigured(): boolean
  async verifyConnection(): Promise<boolean>
}
```

### **3. Templates (`templates/templateManager.ts`)**
Database-driven template management:
```typescript
export class TemplateManager {
  async getTemplate(code: string): Promise<EmailTemplate | null>
  replaceVariables(template: string, variables: Record<string, any>): string
  htmlToText(html: string): string
}
```

### **4. Logger (`logger.ts`)**
Comprehensive email logging and analytics:
```typescript
export class EmailLogger {
  async createEmailLog(logData: Partial<EmailLog>): Promise<string>
  async updateEmailLog(logId: string, updates: Partial<EmailLog>): Promise<void>
  async getEmailStats(days: number): Promise<any>
  async getEmailLogs(orderId?: string, limit?: number): Promise<EmailLog[]>
}
```

### **5. Scheduler (`scheduler.ts`)**
Email scheduling and priority management:
```typescript
export class EmailScheduler {
  async scheduleEmail(logId: string, mailOptions: any, scheduledAt: Date): Promise<void>
  getPriorityValue(priority: string): string
}
```

### **6. Workflows (`workflows/`)**

#### **Order Workflows (`orderWorkflows.ts`)**
Business logic for order-related emails:
```typescript
export class OrderWorkflows {
  async getOrderData(orderId: string): Promise<OrderData | null>
  prepareOrderConfirmationData(order: OrderData): EmailData | null
  prepareOrderStatusUpdateData(order: OrderData, newStatus: string): EmailData | null
  prepareReviewRequestData(order: OrderData): EmailData | null
}
```

#### **Admin Workflows (`adminWorkflows.ts`)**
Business logic for admin notifications:
```typescript
export class AdminWorkflows {
  async getAdminEmails(): Promise<string[]>
  preparePaymentNotificationData(order: OrderData): EmailData[]
  prepareOrderNotificationData(order: OrderData): EmailData[]
}
```

### **7. Main Service (`emailService.ts`)**
Orchestrates all components and provides clean public API:
- Core email sending functionality
- Workflow method implementations
- Health checking and statistics
- Error handling and logging

## 🚀 **Usage Examples**

### **Basic Email Sending**
```typescript
import { emailService } from './emailV2/emailService';

const emailData: EmailData = {
  templateCode: 'order_confirmation',
  recipient: 'customer@example.com',
  variables: {
    customer_name: 'John Doe',
    order_number: '12345'
  },
  priority: 'high'
};

await emailService.sendEmail(emailData);
```

### **Workflow Methods**
```typescript
// Send order confirmation
await emailService.sendOrderConfirmation(orderId);

// Send status update
await emailService.sendOrderStatusUpdate(orderId, 'shipped');

// Send admin notification
await emailService.sendPaymentNotificationToAdmin(orderId);

// Send review request (scheduled 24h after delivery)
await emailService.sendReviewRequest(orderId);
```

### **Health Check and Statistics**
```typescript
// Check service health
const health = await emailService.checkHealth();
console.log(health.status); // 'healthy' or 'unhealthy'

// Get email statistics
const stats = await emailService.getEmailStats(7); // Last 7 days
```

### **Adding a New Email Provider**
1. Extend the `EmailProviderManager`:
```typescript
// In providers/index.ts
private createCustomProviderTransporter(): nodemailer.Transporter {
  return nodemailer.createTransporter({
    // Custom provider configuration
  });
}
```

2. Add to the setup method:
```typescript
case 'custom':
  this.transporter = this.createCustomProviderTransporter();
  break;
```

### **Adding a New Email Workflow**
1. Create workflow data preparation:
```typescript
// In workflows/customWorkflows.ts
export class CustomWorkflows {
  prepareCustomEmailData(data: any): EmailData | null {
    return {
      templateCode: 'custom_template',
      recipient: data.email,
      variables: { /* custom variables */ },
      priority: 'normal'
    };
  }
}
```

2. Add to main service:
```typescript
async sendCustomEmail(data: any): Promise<boolean> {
  const emailData = this.customWorkflows.prepareCustomEmailData(data);
  if (!emailData) return false;
  return await this.sendEmail(emailData);
}
```

## 🔄 **Backward Compatibility**

The original `emailService-v2.ts` file now re-exports the new modular service:

```typescript
// server/services/emailService-v2.ts
export { emailService as default, emailService } from './emailV2/emailService';
export * from './emailV2/types';
```

This ensures that existing imports continue to work without any changes.

## 📊 **Performance Impact**

### **Build Time**
- **Faster Compilation**: Smaller files compile faster
- **Better Caching**: Individual modules can be cached separately
- **Reduced Memory**: Less memory usage during development

### **Runtime Performance**
- **No Impact**: Same functionality, same performance
- **Better Tree Shaking**: Unused providers/workflows can be eliminated
- **Lazy Loading**: Components can be loaded on demand

## 🧪 **Testing Strategy**

### **Unit Testing**
Each module can be tested independently:
```typescript
// Test provider management
import { EmailProviderManager } from './providers';
// Test template management
import { TemplateManager } from './templates/templateManager';
// Test workflows
import { OrderWorkflows } from './workflows/orderWorkflows';
// Test logging
import { EmailLogger } from './logger';
```

### **Integration Testing**
```typescript
// Test complete email flow
import { emailService } from './emailService';

describe('EmailService Integration', () => {
  it('should send order confirmation email', async () => {
    const result = await emailService.sendOrderConfirmation('order-123');
    expect(result).toBe(true);
  });
});
```

## 🔮 **Future Enhancements**

### **Planned Improvements**
1. **Queue System**: Replace setTimeout with Redis/Bull Queue for production
2. **Template Editor**: Visual template editor with live preview
3. **A/B Testing**: Email template A/B testing capabilities
4. **Analytics Dashboard**: Real-time email performance dashboard
5. **Webhook Handling**: Handle delivery confirmations and bounces
6. **Multi-language**: Template localization support

### **Extensibility**
The modular structure makes it easy to:
- Add new email providers (AWS SES, Postmark, etc.)
- Create custom workflow types
- Implement advanced scheduling logic
- Add email tracking and analytics
- Integrate with marketing automation tools

## 📚 **Best Practices**

### **Adding New Features**
1. **Create dedicated modules** for new functionality
2. **Use TypeScript interfaces** for type safety
3. **Follow naming conventions** (PascalCase for classes, camelCase for methods)
4. **Add comprehensive error handling**
5. **Update documentation** when adding new features

### **Email Template Best Practices**
1. **Use database templates** for easy management
2. **Implement variable validation**
3. **Test templates** across email clients
4. **Optimize for mobile** devices
5. **Include plain text versions**

### **Provider Management**
1. **Environment-based configuration**
2. **Graceful fallback** to development mode
3. **Connection verification** on startup
4. **Error handling** for provider failures
5. **Rate limiting** consideration

## ✅ **Migration Checklist**

- [x] **Types extracted** to dedicated file
- [x] **Provider management** separated and modularized
- [x] **Template management** extracted to dedicated class
- [x] **Email logging** isolated with comprehensive functionality
- [x] **Scheduling** separated with priority handling
- [x] **Workflows** separated by business domain (orders, admin)
- [x] **Main service simplified** to orchestration layer
- [x] **Backward compatibility** maintained
- [x] **Documentation updated** with comprehensive guide
- [x] **All functionality preserved** during refactoring

## 🎨 **Email Template Management**

### **Database Schema**
```sql
CREATE TABLE email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  subject_template TEXT NOT NULL,
  html_template TEXT NOT NULL,
  text_template TEXT,
  variables JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **Template Variables**
Templates use `{{variable_name}}` syntax:
```html
<h1>Hello {{customer_name}}</h1>
<p>Your order {{order_number}} has been {{status_name}}.</p>
```

### **Template Management API**
```typescript
// Get template
const template = await templateManager.getTemplate('order_confirmation');

// Replace variables
const html = templateManager.replaceVariables(template.htmlTemplate, {
  customer_name: 'John Doe',
  order_number: '12345'
});
```

The email service v2 is now modular, scalable, and ready for enterprise-level email automation! 🎉
