import { RequestHandler } from 'express';
import { db } from '../../database/connection';

// Get all payments
export const getPayments: RequestHandler = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT p.*, o.reference as order_reference, o.total_amount as order_total,
             o.metadata->>'client_phone' as client_phone, o.metadata->>'client_name' as client_name
      FROM payments p JOIN orders o ON p.order_id = o.id ORDER BY p.id DESC LIMIT 50
    `);
    res.json({ success: true, data: result.rows, pagination: { total: result.rows.length, limit: 50, offset: 0, pages: 1 } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la récupération des paiements' });
  }
};

// Get single payment
export const getPayment: RequestHandler = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const result = await db.query(`
      SELECT p.*, o.reference as order_reference, o.total_amount as order_total,
             o.metadata->>'client_phone' as client_phone, o.metadata->>'client_name' as client_name
      FROM payments p JOIN orders o ON p.order_id = o.id WHERE p.id = $1
    `, [paymentId]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, error: 'Paiement non trouvé' });
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la récupération du paiement' });
  }
};

// Get payment statistics
export const getPaymentStats: RequestHandler = async (req, res) => {
  try {
    const stats = await db.query(`
      SELECT COUNT(*) as total_payments,
             COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_count,
             COUNT(CASE WHEN status = 'verified' THEN 1 END) as verified_count,
             COALESCE(SUM(amount), 0) as total_amount
      FROM payments
    `);
    res.json({ success: true, data: stats.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la récupération des statistiques' });
  }
};

// Verify payment
export const verifyPayment: RequestHandler = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const adminId = (req as any).user?.id;
    const result = await db.query(`
      UPDATE payments SET status = 'verified', verified_at = NOW(), verified_by = $1, updated_at = NOW()
      WHERE id = $2 RETURNING *
    `, [adminId, paymentId]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, error: 'Paiement non trouvé' });
    
    await db.query(`
      UPDATE orders SET status = 'confirmed', updated_at = NOW()
      WHERE id = (SELECT order_id FROM payments WHERE id = $1)
    `, [paymentId]);
    
    res.json({ success: true, data: result.rows[0], message: 'Paiement vérifié et commande confirmée' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la vérification du paiement' });
  }
};

// Request new receipt
export const requestNewReceipt: RequestHandler = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { rejection_reason } = req.body;
    const adminId = (req as any).user?.id;
    const result = await db.query(`
      UPDATE payments SET status = 'rejected', rejection_reason = $1, verified_by = $2, updated_at = NOW()
      WHERE id = $3 RETURNING *
    `, [rejection_reason || 'Reçu illisible, veuillez en fournir un nouveau', adminId, paymentId]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, error: 'Paiement non trouvé' });
    res.json({ success: true, data: result.rows[0], message: 'Demande de nouveau reçu envoyée' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la demande de nouveau reçu' });
  }
};