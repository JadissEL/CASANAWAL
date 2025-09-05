import { EmailTemplateData } from '../types';

// =====================================================
// ORDER CONFIRMATION EMAIL TEMPLATE
// =====================================================

export function generateOrderConfirmationTemplate(data: EmailTemplateData): string {
  const { orderDetails, paymentLink, depositAmount } = data;
  
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #D97706, #F59E0B); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">🍽️ CasaNawal</h1>
        <p style="color: #FEF3C7; margin: 10px 0 0 0; font-size: 16px;">Votre commande a été reçue !</p>
      </div>
      
      <div style="background: white; padding: 30px; border: 1px solid #E5E7EB; border-top: none;">
        <h2 style="color: #1F2937; margin-bottom: 20px;">Bonjour ${orderDetails.client_name},</h2>
        
        <p style="color: #6B7280; line-height: 1.6; margin-bottom: 25px;">
          Nous avons bien reçu votre commande <strong>#${orderDetails.reference}</strong>. 
          Voici le récapitulatif de votre commande :
        </p>
        
        <div style="background: #F9FAFB; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
          <h3 style="color: #1F2937; margin-top: 0; margin-bottom: 15px;">📋 Récapitulatif de la commande</h3>
          
          <div style="margin-bottom: 15px;">
            <strong style="color: #374151;">Référence :</strong> #${orderDetails.reference}<br>
            <strong style="color: #374151;">Date :</strong> ${new Date(orderDetails.created_at).toLocaleDateString('fr-FR')}<br>
            <strong style="color: #374151;">Livraison :</strong> ${orderDetails.delivery_address}<br>
            <strong style="color: #374151;">Créneau :</strong> ${orderDetails.delivery_time}
          </div>
          
          <div style="border-top: 1px solid #E5E7EB; padding-top: 15px;">
            <h4 style="margin: 0 0 10px 0; color: #374151;">Articles commandés :</h4>
            ${orderDetails.items.map(item => `
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #6B7280;">${item.quantity}x ${item.name}</span>
                <span style="color: #1F2937; font-weight: 600;">${item.price.toFixed(2)} MAD</span>
              </div>
            `).join('')}
            
            <div style="border-top: 1px solid #E5E7EB; margin-top: 15px; padding-top: 15px;">
              <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: bold;">
                <span style="color: #374151;">Total :</span>
                <span style="color: #D97706;">${orderDetails.total_amount.toFixed(2)} MAD</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-top: 8px; color: #059669;">
                <span>Livraison :</span>
                <span><s style="color: #9CA3AF;">25 MAD</s> <strong>GRATUIT</strong></span>
              </div>
            </div>
          </div>
        </div>
        
        <div style="background: #FEF3C7; border: 1px solid #F59E0B; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
          <h3 style="color: #92400E; margin-top: 0; margin-bottom: 15px;">💳 Étape suivante : Paiement</h3>
          <p style="color: #92400E; margin-bottom: 15px; line-height: 1.6;">
            Pour confirmer votre commande, vous devez effectuer un acompte de <strong>minimum 50%</strong> 
            soit <strong>${depositAmount} MAD</strong> sur le montant total.
          </p>
          
          <div style="text-align: center; margin: 20px 0;">
            <a href="${paymentLink}" style="display: inline-block; background: linear-gradient(135deg, #D97706, #F59E0B); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
              🔗 Accéder au paiement
            </a>
          </div>
          
          <p style="color: #92400E; font-size: 14px; margin-bottom: 0;">
            <strong>Moyens de paiement acceptés :</strong><br>
            • Virement bancaire<br>
            • PayPal<br>
            • Western Union<br>
            • Wise (ex-TransferWise)
          </p>
        </div>
        
        <div style="border-top: 1px solid #E5E7EB; padding-top: 20px; text-align: center;">
          <p style="color: #6B7280; margin-bottom: 10px;">
            <strong>Besoin d'aide ?</strong> Contactez-nous :
          </p>
          <p style="color: #6B7280; margin: 0;">
            📞 +212 XXX XXX XXX<br>
            📧 contact@casanawal.com
          </p>
        </div>
      </div>
      
      <div style="background: #F3F4F6; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; color: #6B7280;">
        <p style="margin: 0;">© 2025 CasaNawal - Cuisine marocaine authentique</p>
        <p style="margin: 5px 0 0 0;">Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
      </div>
    </div>
  `;
}
