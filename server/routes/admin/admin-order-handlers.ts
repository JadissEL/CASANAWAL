// =====================================================
// ADMIN ORDER HANDLERS - REFACTORED FROM SIMPLE-ALL.TS (≤150 lines)
// =====================================================

import { RequestHandler } from "express";
import { db } from "../../database/connection";

// GET ALL ORDERS
export const getAllOrders: RequestHandler = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT o.*, c.name as customer_name, c.email as customer_email
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      ORDER BY o.created_at DESC
    `);
    
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Erreur récupération commandes:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
};

// GET ORDER BY ID
export const getOrderById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.query(`
      SELECT o.*, c.name as customer_name, c.email as customer_email
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      WHERE o.id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Commande non trouvée' });
    }
    
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Erreur récupération commande:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
};

// UPDATE ORDER STATUS
export const updateOrderStatus: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const result = await db.query(
      'UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [status, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Commande non trouvée' });
    }
    
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Erreur mise à jour statut commande:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
};

// Alias for getAllOrders
export const getOrders = getAllOrders;
