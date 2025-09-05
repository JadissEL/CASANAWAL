import { EmailTemplateData } from '../types';

// =====================================================
// ORDER VALIDATION EMAIL TEMPLATE
// =====================================================

export function generateOrderValidatedTemplate(data: EmailTemplateData): string {
  const { orderDetails, remainingAmount } = data;
  
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #059669, #10B981); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">🎉 CasaNawal</h1>
        <p style="color: #D1FAE5; margin: 10px 0 0 0; font-size: 16px;">Votre commande est confirmée !</p>
      </div>
      
      <div style="background: white; padding: 30px; border: 1px solid #E5E7EB; border-top: none;">
        <h2 style="color: #1F2937; margin-bottom: 20px;">Excellente nouvelle ${orderDetails.client_name} !</h2>
        
        <p style="color: #6B7280; line-height: 1.6; margin-bottom: 25px;">
          Votre commande <strong>#${orderDetails.reference}</strong> a été validée par notre équipe. 
          Nous commençons la préparation de vos délicieux plats marocains !
        </p>
        
        <div style="background: #F0FDF4; border: 1px solid #10B981; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
          <h3 style="color: #059669; margin-top: 0; margin-bottom: 15px;">✅ Statut de votre commande</h3>
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span style="color: #374151;">Référence :</span>
            <span style="color: #1F2937; font-weight: 600;">#${orderDetails.reference}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span style="color: #374151;">Statut :</span>
            <span style="color: #059669; font-weight: 600;">✅ CONFIRMÉE</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span style="color: #374151;">Livraison prévue :</span>
            <span style="color: #1F2937; font-weight: 600;">${orderDetails.delivery_time}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #374151;">Adresse :</span>
            <span style="color: #1F2937; font-weight: 600;">${orderDetails.delivery_address}</span>
          </div>
        </div>
        
        <div style="background: #F9FAFB; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
          <h3 style="color: #1F2937; margin-top: 0; margin-bottom: 15px;">📋 Détails de votre commande</h3>
          
          ${orderDetails.items.map(item => `
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="color: #6B7280;">${item.quantity}x ${item.name}</span>
              <span style="color: #1F2937; font-weight: 600;">${item.price.toFixed(2)} MAD</span>
            </div>
          `).join('')}
          
          <div style="border-top: 1px solid #E5E7EB; margin-top: 15px; padding-top: 15px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="color: #374151;">Sous-total :</span>
              <span style="color: #1F2937;">${orderDetails.total_amount.toFixed(2)} MAD</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px; color: #059669;">
              <span>Livraison :</span>
              <span><s style="color: #9CA3AF;">25 MAD</s> <strong>GRATUIT</strong></span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: bold; border-top: 1px solid #E5E7EB; padding-top: 10px;">
              <span style="color: #374151;">Total :</span>
              <span style="color: #D97706;">${orderDetails.total_amount.toFixed(2)} MAD</span>
            </div>
          </div>
        </div>
        
        ${remainingAmount && remainingAmount > 0 ? `
        <div style="background: #FEF3C7; border: 1px solid #F59E0B; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
          <h3 style="color: #92400E; margin-top: 0; margin-bottom: 15px;">💰 Solde restant</h3>
          <p style="color: #92400E; margin-bottom: 10px;">
            Solde à régler à la livraison : <strong>${remainingAmount.toFixed(2)} MAD</strong>
          </p>
          <p style="color: #92400E; font-size: 14px; margin: 0;">
            Vous pouvez régler le solde en espèces ou par carte bancaire à la livraison.
          </p>
        </div>
        ` : `
        <div style="background: #F0FDF4; border: 1px solid #10B981; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
          <h3 style="color: #059669; margin-top: 0; margin-bottom: 10px;">💯 Paiement complet</h3>
          <p style="color: #059669; margin: 0;">
            Votre commande est entièrement payée. Aucun solde à régler à la livraison !
          </p>
        </div>
        `}
        
        <div style="background: #FEF2F2; border: 1px solid #F87171; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
          <h3 style="color: #DC2626; margin-top: 0; margin-bottom: 15px;">📞 Préparation en cours</h3>
          <p style="color: #DC2626; margin: 0; line-height: 1.6;">
            Notre équipe prépare votre commande avec amour et attention. 
            Nous vous contacterons 30 minutes avant la livraison pour confirmer votre présence.
          </p>
        </div>
        
        <div style="border-top: 1px solid #E5E7EB; padding-top: 20px; text-align: center;">
          <p style="color: #6B7280; margin-bottom: 10px;">
            <strong>Questions ou modifications ?</strong> Contactez-nous rapidement :
          </p>
          <p style="color: #6B7280; margin: 0;">
            📞 +212 XXX XXX XXX<br>
            📧 contact@casanawal.com
          </p>
        </div>
      </div>
      
      <div style="background: #F3F4F6; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; color: #6B7280;">
        <p style="margin: 0;">© 2025 CasaNawal - Merci de nous faire confiance !</p>
        <p style="margin: 5px 0 0 0;">Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
      </div>
    </div>
  `;
}
