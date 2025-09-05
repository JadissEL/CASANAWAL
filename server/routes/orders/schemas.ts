import { z } from "zod";

// Validation schemas for orders
export const OrderItemSchema = z.object({
  product_id: z.string().uuid().optional(),
  product_name_snapshot: z.string().min(1),
  quantity: z.number().positive(),
  portion_persons: z.number().positive(),
  unit_price: z.number().positive(),
  total_price: z.number().positive(),
  product_details_snapshot: z.any().optional()
});

export const OrderCreateSchema = z.object({
  client_phone: z.string().min(1),
  client_email: z.string().email().optional(),
  client_name: z.string().optional(),
  subtotal: z.number().positive(),
  discount_amount: z.number().min(0).optional(),
  delivery_fee: z.number().min(0),
  deposit_required: z.number().positive(),
  total_amount: z.number().positive(),
  delivery_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  delivery_slot: z.string().min(1),
  delivery_address: z.string().min(1),
  notes: z.string().optional(),
  items: z.array(OrderItemSchema).min(1)
});
