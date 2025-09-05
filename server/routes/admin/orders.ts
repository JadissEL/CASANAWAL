import { RequestHandler } from 'express';
import { db } from '../../database/connection';

// Get all orders
export const getOrders: RequestHandler = async (req, res) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;
    let query = `
      SELECT o.*, o.metadata->>'client_phone' as client_phone, o.metadata->>'client_name' as client_name, o.metadata->>'client_email' as client_email
      FROM orders o WHERE 1=1
    `;
    const params: any[] = [];
    let paramIndex = 1;
    if (status) {
      query += ` AND o.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }
    query += ` ORDER BY o.id DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(parseInt(limit as string), parseInt(offset as string));
    const result = await db.query(query, params);
    
    let countQuery = 'SELECT COUNT(*) FROM orders WHERE 1=1';
    const countParams: any[] = [];
    if (status) {
      countQuery += ` AND status = $1`;
      countParams.push(status);
    }
    const countResult = await db.query(countQuery, countParams);
    const totalCount = parseInt(countResult.rows[0].count);
    
    res.json({
      success: true, data: result.rows,
      pagination: { total: totalCount, limit: parseInt(limit as string), offset: parseInt(offset as string), pages: Math.ceil(totalCount / parseInt(limit as string)) }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la récupération des commandes' });
  }
};

// Get single order
export const getOrder: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(`
      SELECT o.*, o.metadata->>'client_phone' as client_phone, o.metadata->>'client_name' as client_name, o.metadata->>'client_email' as client_email
      FROM orders o WHERE o.id = $1
    `, [id]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, error: 'Commande non trouvée' });
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la récupération de la commande' });
  }
};

// Update order status
export const updateOrderStatus: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    if (!status) return res.status(400).json({ success: false, error: 'Statut requis' });
    
    const validStatuses = ['pending_deposit', 'confirmed', 'in_preparation', 'ready', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) return res.status(400).json({ success: false, error: 'Statut invalide' });
    
    const result = await db.query(`
      UPDATE orders SET status = $1, notes = COALESCE($2, notes), updated_at = NOW() WHERE id = $3 RETURNING *
    `, [status, notes, id]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, error: 'Commande non trouvée' });
    res.json({ success: true, data: result.rows[0], message: 'Statut de la commande mis à jour avec succès' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la mise à jour du statut' });
  }
};

// Get order statistics
export const getOrderStats: RequestHandler = async (req, res) => {
  try {
    const stats = await db.query(`
      SELECT COUNT(*) as total_orders,
             COUNT(CASE WHEN status = 'pending_deposit' THEN 1 END) as pending_count,
             COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed_count,
             COUNT(CASE WHEN status = 'in_preparation' THEN 1 END) as preparation_count,
             COUNT(CASE WHEN status = 'delivered' THEN 1 END) as delivered_count,
             COALESCE(SUM(total_amount), 0) as total_revenue,
             COALESCE(AVG(total_amount), 0) as average_order_value
      FROM orders WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
    `);
    res.json({ success: true, data: stats.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la récupération des statistiques' });
  }
};