import { db } from "../../database/connection";

// Query functions for orders
export interface OrderFilters {
  status?: string;
  client_phone?: string;
  page?: string;
  limit?: string;
}

export interface OrderResult {
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
  };
}

// Get orders with filtering and pagination
export const getOrdersQuery = async (filters: OrderFilters): Promise<OrderResult> => {
  try {
    const {
      status,
      client_phone,
      page = '1',
      limit = '20'
    } = filters;

    let query = `
      SELECT o.*,
             o.metadata->>'client_phone' as client_phone,
             o.metadata->>'client_name' as client_name
      FROM orders o WHERE 1=1
    `;
    const params: any[] = [];
    let paramIndex = 1;

    if (status) {
      query += ` AND o.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    if (client_phone) {
      query += ` AND o.metadata->>'client_phone' = $${paramIndex}`;
      params.push(client_phone);
      paramIndex++;
    }

    query += ` ORDER BY o.id DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));

    const result = await db.query(query, params);

    return {
      success: true,
      data: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: result.rows.length
      }
    };
  } catch (error) {
    console.error('Get orders query error:', error);
    return {
      success: false,
      error: 'Failed to fetch orders'
    };
  }
};

// Get single order by reference
export const getOrderByReferenceQuery = async (reference: string): Promise<OrderResult> => {
  try {
    const result = await db.query(`
      SELECT o.*,
             o.metadata->>'client_phone' as client_phone,
             o.metadata->>'client_name' as client_name,
             o.metadata->>'client_email' as client_email
      FROM orders o
      WHERE o.reference = $1
    `, [reference]);

    if (result.rows.length === 0) {
      return {
        success: false,
        error: 'Order not found'
      };
    }

    // Get order items
    const itemsResult = await db.query(`
      SELECT * FROM order_items WHERE order_id = $1
    `, [result.rows[0].id]);

    const order = {
      ...result.rows[0],
      items: itemsResult.rows
    };

    return {
      success: true,
      data: order
    };
  } catch (error) {
    console.error('Get order by reference query error:', error);
    return {
      success: false,
      error: 'Failed to fetch order'
    };
  }
};

// Create new order
export const createOrderQuery = async (orderData: any, req: any): Promise<OrderResult> => {
  try {
    const { items, client_phone, client_email, client_name, ...orderDetails } = orderData;

    // Generate unique reference
    const reference = `CMD-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

    // Create order
    const orderResult = await db.query(`
      INSERT INTO orders (
        reference, status, subtotal, discount_amount, delivery_fee,
        deposit_required, total_amount, delivery_date, delivery_slot,
        delivery_address, notes, metadata
      ) VALUES (
        $1, 'pending_deposit', $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
      ) RETURNING *
    `, [
      reference,
      orderDetails.subtotal,
      orderDetails.discount_amount || 0,
      orderDetails.delivery_fee,
      orderDetails.deposit_required,
      orderDetails.total_amount,
      orderDetails.delivery_date,
      orderDetails.delivery_slot,
      orderDetails.delivery_address,
      orderDetails.notes,
      JSON.stringify({
        client_phone,
        client_email,
        client_name,
        created_from: 'website',
        ip: req.ip,
        user_agent: req.get('User-Agent')
      })
    ]);

    const order = orderResult.rows[0];

    // Create order items
    for (const item of items) {
      await db.query(`
        INSERT INTO order_items (
          order_id, product_id, product_name_snapshot, quantity,
          portion_persons, unit_price, total_price, product_details_snapshot
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, [
        order.id,
        item.product_id,
        item.product_name_snapshot,
        item.quantity,
        item.portion_persons,
        item.unit_price,
        item.total_price,
        JSON.stringify(item.product_details_snapshot || {})
      ]);
    }

    return {
      success: true,
      data: {
        ...order,
        items
      },
      message: 'Order created successfully'
    };
  } catch (error) {
    console.error('Create order query error:', error);
    return {
      success: false,
      error: 'Failed to create order'
    };
  }
};
