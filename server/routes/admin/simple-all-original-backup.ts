import { RequestHandler } from "express";
import { db } from "../../database/connection";

export const getAllProductsSimple: RequestHandler = async (req, res) => {
  try {
    const result = await db.query('SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id ORDER BY p.name ASC');
    res.json({ success: true, data: result.rows });
  } catch (error) { res.status(500).json({ success: false, error: 'Server error' }); }
};
export const getProductByIdSimple: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, error: 'Product not found' });
    res.json({ success: true, data: result.rows[0] });
  } catch (error) { res.status(500).json({ success: false, error: 'Server error' }); }
};
export const createProductSimple: RequestHandler = async (req, res) => {
  try {
    const { sku, name, description, base_price, category_id, is_active = true } = req.body;
    const result = await db.query('INSERT INTO products (sku, name, description, base_price, category_id, is_active) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [sku, name, description, base_price, category_id, is_active]);
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) { res.status(500).json({ success: false, error: 'Server error' }); }
};
export const updateProductSimple: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, base_price, is_active } = req.body;
    const result = await db.query('UPDATE products SET name = COALESCE($1, name), description = COALESCE($2, description), base_price = COALESCE($3, base_price), is_active = COALESCE($4, is_active), updated_at = NOW() WHERE id = $5 RETURNING *', [name, description, base_price, is_active, id]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, error: 'Product not found' });
    res.json({ success: true, data: result.rows[0] });
  } catch (error) { res.status(500).json({ success: false, error: 'Server error' }); }
};
export const deleteProductSimple: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, error: 'Product not found' });
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) { res.status(500).json({ success: false, error: 'Server error' }); }
};
export const toggleProductStatusSimple: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('UPDATE products SET is_active = NOT is_active WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, error: 'Product not found' });
    res.json({ success: true, data: result.rows[0] });
  } catch (error) { res.status(500).json({ success: false, error: 'Server error' }); }
};
export const getAllOrdersSimple: RequestHandler = async (req, res) => {
  try {
    const result = await db.query('SELECT o.*, c.name as customer_name FROM orders o LEFT JOIN customers c ON o.customer_id = c.id ORDER BY o.created_at DESC');
    res.json({ success: true, data: result.rows });
  } catch (error) { res.status(500).json({ success: false, error: 'Server error' }); }
};
export const getOrderByIdSimple: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT o.*, c.name as customer_name FROM orders o LEFT JOIN customers c ON o.customer_id = c.id WHERE o.id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, error: 'Order not found' });
    res.json({ success: true, data: result.rows[0] });
  } catch (error) { res.status(500).json({ success: false, error: 'Server error' }); }
};
export const updateOrderStatusSimple: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const result = await db.query('UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *', [status, id]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, error: 'Order not found' });
    res.json({ success: true, data: result.rows[0] });
  } catch (error) { res.status(500).json({ success: false, error: 'Server error' }); }
};

export const getAllCustomersSimple: RequestHandler = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM customers ORDER BY created_at DESC');
    res.json({ success: true, data: result.rows });
  } catch (error) { res.status(500).json({ success: false, error: 'Server error' }); }
};

export const getCustomerByIdSimple: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM customers WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, error: 'Customer not found' });
    res.json({ success: true, data: result.rows[0] });
  } catch (error) { res.status(500).json({ success: false, error: 'Server error' }); }
};

export const requestNewReceiptSimple: RequestHandler = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const result = await db.query('UPDATE payments SET status = $1 WHERE id = $2 RETURNING *', ['receipt_requested', paymentId]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, error: 'Payment not found' });
    res.json({ success: true, data: result.rows[0] });
  } catch (error) { res.status(500).json({ success: false, error: 'Server error' }); }
};

export const getDashboardStatsSimple: RequestHandler = async (req, res) => {
  try {
    const ordersResult = await db.query('SELECT COUNT(*) as total, SUM(CASE WHEN status = $1 THEN 1 ELSE 0 END) as pending FROM orders', ['pending']);
    const revenueResult = await db.query('SELECT COALESCE(SUM(total_amount), 0) as today_revenue FROM orders WHERE DATE(created_at) = CURRENT_DATE');
    res.json({ success: true, data: { total_orders: parseInt(ordersResult.rows[0].total), pending_orders: parseInt(ordersResult.rows[0].pending), today_revenue: parseFloat(revenueResult.rows[0].today_revenue) } });
  } catch (error) { res.status(500).json({ success: false, error: 'Server error' }); }
};

export const getCategoriesSimple: RequestHandler = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM categories ORDER BY name ASC');
    res.json({ success: true, data: result.rows });
  } catch (error) { res.status(500).json({ success: false, error: 'Server error' }); }
};

export const getPaymentsSimple: RequestHandler = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM payments ORDER BY created_at DESC LIMIT 50');
    res.json({ success: true, data: result.rows });
  } catch (error) { res.status(500).json({ success: false, error: 'Server error' }); }
};

export const verifyPaymentSimple: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('UPDATE payments SET status = $1 WHERE id = $2 RETURNING *', ['verified', id]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, error: 'Payment not found' });
    res.json({ success: true, data: result.rows[0] });
  } catch (error) { res.status(500).json({ success: false, error: 'Server error' }); }
};

// Backward compatibility aliases
export { getAllProductsSimple as getAllProducts, getProductByIdSimple as getProductById, createProductSimple as createProduct, 
updateProductSimple as updateProduct, deleteProductSimple as deleteProduct, toggleProductStatusSimple as toggleProductStatus, 
getAllProductsSimple as getProducts, getAllOrdersSimple as getAllOrders, getOrderByIdSimple as getOrderById, 
updateOrderStatusSimple as updateOrderStatus, getAllOrdersSimple as getOrders, getAllCustomersSimple as getAllCustomers, 
getCustomerByIdSimple as getCustomerById, requestNewReceiptSimple as requestNewReceipt, getDashboardStatsSimple as getDashboardStats, 
getCategoriesSimple as getCategories, getPaymentsSimple as getPayments, verifyPaymentSimple as verifyPayment };
