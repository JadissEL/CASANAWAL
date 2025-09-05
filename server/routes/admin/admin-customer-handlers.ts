// =====================================================
// ADMIN CUSTOMER HANDLERS - REFACTORED FROM SIMPLE-ALL.TS (≤150 lines)
// =====================================================

import { RequestHandler } from "express";
import { db } from "../../database/connection";

// GET ALL CUSTOMERS
export const getAllCustomers: RequestHandler = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM customers ORDER BY created_at DESC');
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Erreur récupération clients:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
};

// GET CUSTOMER BY ID
export const getCustomerById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.query('SELECT * FROM customers WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Client non trouvé' });
    }
    
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Erreur récupération client:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
};
