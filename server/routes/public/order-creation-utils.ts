// =====================================================
// ORDER CREATION UTILITIES (≤150 lines)
// =====================================================

import { db } from "../../database/connection";

// Create or get client
export const createOrGetClient = async (client_info: any, delivery_info: any): Promise<string> => {
  let clientResult = await db.query(
    'SELECT * FROM clients WHERE phone = $1',
    [client_info.phone]
  );

  let clientId;
  if (clientResult.rows.length === 0) {
    // Create new client
    const newClientResult = await db.query(`
      INSERT INTO clients (phone, email, first_name, last_name, default_address)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `, [
      client_info.phone,
      client_info.email || null,
      client_info.first_name || null,
      client_info.last_name || null,
      delivery_info.address
    ]);
    clientId = newClientResult.rows[0].id;
  } else {
    clientId = clientResult.rows[0].id;
    
    // Update client info if provided
    if (client_info.email || client_info.first_name || client_info.last_name) {
      await db.query(`
        UPDATE clients 
        SET 
          email = COALESCE($2, email),
          first_name = COALESCE($3, first_name),
          last_name = COALESCE($4, last_name),
          default_address = $5
        WHERE id = $1
      `, [
        clientId,
        client_info.email,
        client_info.first_name,
        client_info.last_name,
        delivery_info.address
      ]);
    }
  }

  return clientId;
};

// Calculate order totals and validate items
export const calculateOrderTotals = async (items: any[], promo_code?: string) => {
  let subtotal = 0;
  const validatedItems = [];

  for (const item of items) {
    // Get product details
    const productResult = await db.query(
      'SELECT * FROM products WHERE id = $1 AND is_available = true',
      [item.product_id]
    );

    if (productResult.rows.length === 0) {
      throw new Error(`Product ${item.product_id} is not available`);
    }

    const product = productResult.rows[0];
    const itemTotal = product.price * item.quantity;
    subtotal += itemTotal;

    validatedItems.push({
      product_id: item.product_id,
      product_name: product.name,
      price: product.price,
      quantity: item.quantity,
      total: itemTotal,
      customizations: item.customizations || []
    });
  }

  // Apply promo code if provided
  let discountAmount = 0;
  if (promo_code) {
    const promoResult = await db.query(`
      SELECT * FROM promo_codes 
      WHERE code = $1 AND is_active = true 
      AND valid_from <= CURRENT_DATE AND valid_until >= CURRENT_DATE
    `, [promo_code]);

    if (promoResult.rows.length > 0) {
      const promo = promoResult.rows[0];
      if (promo.type === 'percentage') {
        discountAmount = subtotal * (promo.value / 100);
      } else if (promo.type === 'fixed_amount') {
        discountAmount = Math.min(promo.value, subtotal);
      }
    }
  }

  const totalAmount = subtotal - discountAmount;
  const depositRequired = Math.ceil(totalAmount * 0.3); // 30% deposit

  return { subtotal, validatedItems, totalAmount, depositRequired, discountAmount };
};

// Create order record
export const createOrderRecord = async (orderData: any) => {
  const reference = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
  
  const orderResult = await db.query(`
    INSERT INTO orders (
      reference, client_id, status, subtotal, discount_amount, delivery_fee, 
      total_amount, deposit_required, delivery_date, delivery_slot, 
      delivery_address, payment_method, notes, metadata
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    RETURNING *
  `, [
    reference,
    orderData.clientId,
    'pending_payment',
    orderData.subtotal,
    orderData.discountAmount || 0,
    orderData.deliveryFee,
    orderData.totalAmount,
    orderData.depositRequired,
    orderData.delivery_info.date,
    orderData.delivery_info.slot,
    orderData.delivery_info.address,
    orderData.payment_info?.method || 'bank_transfer',
    orderData.notes || null,
    JSON.stringify({
      zone: orderData.delivery_info.zone,
      promo_code: orderData.promo_code
    })
  ]);

  return orderResult.rows[0];
};

// Create order items (simplified)
export const createOrderItems = async (orderId: string, items: any[]) => {
  for (const item of items) {
    await db.query('INSERT INTO order_items (order_id, product_id, product_name_snapshot, price_snapshot, quantity, total_price) VALUES ($1, $2, $3, $4, $5, $6)', 
      [orderId, item.product_id, item.product_name, item.price, item.quantity, item.total]);
  }
};
