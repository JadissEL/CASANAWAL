import { EmailTemplateData } from '../types';

// =====================================================
// RECEIPT REQUEST EMAIL TEMPLATE
// =====================================================

export function generateReceiptRequestTemplate(data: EmailTemplateData): string {
  const { orderDetails, paymentLink, reason } = data;
  
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #DC2626, #EF4444); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">⚠️ CasaNawal</h1>
        <p style="color: #FEE2E2; margin: 10px 0 0 0; font-size: 16px;">Action requise pour votre commande</p>
      </div>
      
      <div style="background: white; padding: 30px; border: 1px solid #E5E7EB; border-top: none;">
        <h2 style="color: #1F2937; margin-bottom: 20px;">Bonjour ${orderDetails.client_name},</h2>
        
        <p style="color: #6B7280; line-height: 1.6; margin-bottom: 25px;">
          Concernant votre commande <strong>#${orderDetails.reference}</strong>, 
          nous avons besoin d'un nouveau justificatif de paiement.
        </p>
        
        <div style="background: #FEF2F2; border: 1px solid #F87171; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
          <h3 style="color: #DC2626; margin-top: 0; margin-bottom: 15px;">📋 Motif de la demande</h3>
          <p style="color: #DC2626; margin: 0; line-height: 1.6;">
            ${reason}
          </p>
        </div>
        
        <div style="background: #FEF3C7; border: 1px solid #F59E0B; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
          <h3 style="color: #92400E; margin-top: 0; margin-bottom: 15px;">🔄 Action à effectuer</h3>
          <p style="color: #92400E; margin-bottom: 15px; line-height: 1.6;">
            Veuillez uploader un nouveau justificatif de paiement en cliquant sur le lien ci-dessous :
          </p>
          
          <div style="text-align: center; margin: 20px 0;">
            <a href="${paymentLink}" style="display: inline-block; background: linear-gradient(135deg, #D97706, #F59E0B); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
              📎 Uploader un nouveau reçu
            </a>
          </div>
          
          <p style="color: #92400E; font-size: 14px; margin: 0;">
            <strong>Important :</strong> Assurez-vous que le reçu soit lisible et contienne toutes les informations nécessaires.
          </p>
        </div>
        
        <div style="border-top: 1px solid #E5E7EB; padding-top: 20px; text-align: center;">
          <p style="color: #6B7280; margin-bottom: 10px;">
            <strong>Questions ?</strong> Contactez-nous :
          </p>
          <p style="color: #6B7280; margin: 0;">
            📞 +212 XXX XXX XXX<br>
            📧 contact@casanawal.com
          </p>
        </div>
      </div>
      
      <div style="background: #F3F4F6; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; color: #6B7280;">
        <p style="margin: 0;">© 2025 CasaNawal - Cuisine marocaine authentique</p>
      </div>
    </div>
  `;
}
