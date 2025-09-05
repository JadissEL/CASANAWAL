import { RequestHandler } from "express";
import { OrderCreateSchema } from "./schemas";
import { getOrdersQuery, getOrderByReferenceQuery, createOrderQuery } from "./queries";

// Route handlers for orders

// Get orders with filtering and pagination
export const getOrders: RequestHandler = async (req, res) => {
  try {
    const {
      status,
      client_phone,
      page = '1',
      limit = '20'
    } = req.query;

    const result = await getOrdersQuery({
      status: status as string,
      client_phone: client_phone as string,
      page: page as string,
      limit: limit as string
    });

    if (result.success) {
      res.json({
        success: true,
        data: result.data,
        pagination: result.pagination
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Get orders handler error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch orders'
    });
  }
};

// Get single order by reference
export const getOrder: RequestHandler = async (req, res) => {
  try {
    const { reference } = req.params;

    const result = await getOrderByReferenceQuery(reference);

    if (result.success) {
      res.json({
        success: true,
        data: result.data
      });
    } else {
      const statusCode = result.error === 'Order not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Get order handler error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch order'
    });
  }
};

// Create new order
export const createOrder: RequestHandler = async (req, res) => {
  try {
    const validatedData = OrderCreateSchema.parse(req.body);

    const result = await createOrderQuery(validatedData, req);

    if (result.success) {
      res.status(201).json({
        success: true,
        data: result.data,
        message: result.message
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Create order handler error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create order'
    });
  }
};
