import { RequestHandler } from 'express';
import { db } from '../database/connection';
import { z } from 'zod';

// Validation schema for payment upload
const paymentUploadSchema = z.object({
  order_id: z.string().uuid('ID de commande invalide'),
  amount: z.number().positive('Le montant doit être positif'),
  payment_method: z.string().min(1, 'La méthode de paiement est requise'),
  receipt_url: z.string().url('URL de reçu invalide')
});

// Upload payment receipt
export const uploadPaymentReceipt: RequestHandler = async (req, res) => {
  try {
    const validatedData = paymentUploadSchema.parse(req.body);
    
    // Check if order exists and get details
    const orderResult = await db.query(`
      SELECT o.*, 
             COUNT(p.id) as existing_payments
      FROM orders o
      LEFT JOIN payments p ON o.id = p.order_id AND p.status != 'rejected'
      WHERE o.id = $1
      GROUP BY o.id
    `, [validatedData.order_id]);
    
    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Commande non trouvée'
      });
    }
    
    const order = orderResult.rows[0];
    
    // Check if order is still eligible for payment
    if (order.status === 'cancelled' || order.status === 'completed') {
      return res.status(400).json({
        success: false,
        error: 'Cette commande ne peut plus recevoir de paiements'
      });
    }
    
    // Check if there's already a pending or verified payment
    if (order.existing_payments > 0) {
      return res.status(400).json({
        success: false,
        error: 'Un paiement est déjà en cours de traitement pour cette commande'
      });
    }
    
    // Validate payment amount (must be at least 50% of order total)
    const minimumAmount = Math.ceil(order.total_amount * 0.5);
    if (validatedData.amount < minimumAmount) {
      return res.status(400).json({
        success: false,
        error: `Le montant minimum requis est de ${minimumAmount} MAD (50% du total)`
      });
    }
    
    // Create payment record
    const paymentResult = await db.query(`
      INSERT INTO payments (
        order_id, amount, payment_method, receipt_url, status, submitted_at
      ) VALUES ($1, $2, $3, $4, 'pending', NOW())
      RETURNING *
    `, [
      validatedData.order_id,
      validatedData.amount,
      validatedData.payment_method,
      validatedData.receipt_url
    ]);
    
    // Update order status to indicate payment submitted
    await db.query(`
      UPDATE orders 
      SET payment_status = 'partial',
          deposit_amount = $1,
          remaining_amount = total_amount - $1,
          updated_at = NOW()
      WHERE id = $2
    `, [validatedData.amount, validatedData.order_id]);
    
    res.status(201).json({
      success: true,
      data: paymentResult.rows[0],
      message: 'Reçu de paiement uploadé avec succès'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Données invalides',
        details: error.errors
      });
    }
    
    console.error('Error uploading payment receipt:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de l\'upload du reçu'
    });
  }
};

// Get payment status for an order
export const getOrderPaymentStatus: RequestHandler = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const result = await db.query(`
      SELECT p.*, o.total_amount, o.reference as order_reference
      FROM payments p
      JOIN orders o ON p.order_id = o.id
      WHERE p.order_id = $1
      ORDER BY p.submitted_at DESC
      LIMIT 1
    `, [orderId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Aucun paiement trouvé pour cette commande'
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching payment status:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération du statut de paiement'
    });
  }
};
