// =====================================================
// EMAIL TEMPLATE MANAGER
// =====================================================

import { db } from '../../../database/connection';
import { EmailTemplate, TemplateManagerInterface } from '../types';

export class TemplateManager implements TemplateManagerInterface {
  async getTemplate(code: string): Promise<EmailTemplate | null> {
    try {
      const result = await db.query(
        'SELECT * FROM email_templates WHERE code = $1 AND is_active = true',
        [code]
      );
      
      if (result.rows.length === 0) {
        console.warn(`Email template not found: ${code}`);
        return null;
      }

      const template = result.rows[0];
      return {
        id: template.id,
        code: template.code,
        name: template.name,
        subjectTemplate: template.subject_template,
        htmlTemplate: template.html_template,
        textTemplate: template.text_template,
        variables: template.variables || []
      };
    } catch (error) {
      console.error('Error fetching email template:', error);
      return null;
    }
  }

  replaceVariables(template: string, variables: Record<string, any>): string {
    let result = template;
    
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      result = result.replace(regex, String(value || ''));
    });

    // Nettoyer les variables non remplacées
    result = result.replace(/{{[^}]*}}/g, '');
    
    return result;
  }

  htmlToText(html: string): string {
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .trim();
  }
}
