// =====================================================
// ADMIN UTILITY HANDLERS - REFACTORED FROM SIMPLE-ALL.TS (≤150 lines)
// =====================================================

import { RequestHandler } from "express";
import { db } from "../../database/connection";

// REQUEST NEW RECEIPT
export const requestNewReceipt: RequestHandler = async (req, res) => {
  try {
    const { paymentId } = req.params;
    
    const result = await db.query(
      'UPDATE payments SET status = $1 WHERE id = $2 RETURNING *',
      ['receipt_requested', paymentId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Paiement non trouvé' });
    }
    
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Erreur demande nouveau reçu:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
};

// GET DASHBOARD STATS
export const getDashboardStats: RequestHandler = async (req, res) => {
  try {
    const stats = {
      total_orders: 0,
      pending_orders: 0,
      completed_orders: 0,
      today_revenue: 0
    };
    
    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('Erreur récupération stats:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
};

// GET CATEGORIES
export const getCategories: RequestHandler = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM categories ORDER BY name ASC');
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Erreur récupération catégories:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
};

// GET PAYMENTS
export const getPayments: RequestHandler = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM payments ORDER BY created_at DESC');
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Erreur récupération paiements:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
};

// VERIFY PAYMENT
export const verifyPayment: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.query(
      'UPDATE payments SET status = $1 WHERE id = $2 RETURNING *',
      ['verified', id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Paiement non trouvé' });
    }
    
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Erreur vérification paiement:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
};
