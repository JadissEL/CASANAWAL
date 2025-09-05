import type { Order } from './types';

// Store order locally as fallback
export function storeOrderLocally(order: Order): void {
  try {
    const ordersStr = localStorage.getItem('orders');
    const ordersArr = Array.isArray(JSON.parse(ordersStr || 'null')) ?
      JSON.parse(ordersStr || '[]') : [];

    const orderForStorage = {
      reference: order.reference,
      status: order.status,
      customer: {
        phone: order.client?.phone || '',
        email: order.client?.email || '',
        address: order.delivery_address,
        notes: order.notes || ''
      },
      delivery: {
        date: order.delivery_date,
        slot: order.delivery_slot
      },
      items: order.items?.map(item => ({
        productId: item.product_id,
        name: item.product_name_snapshot,
        qty: item.quantity,
        price: item.unit_price,
        image: item.product_details_snapshot?.image || ''
      })) || [],
      pricing: {
        subtotal: order.subtotal,
        shipping: order.delivery_fee,
        total: order.total_amount,
        deposit_required: order.deposit_required,
        deposit_paid: order.deposit_paid
      },
      payments: [],
      timestamps: {
        createdAt: order.created_at,
        updatedAt: order.updated_at
      },
      meta: {
        ip: "client-ip",
        userAgent: navigator.userAgent,
        createdFromCheckout: true
      }
    };

    const updated = [orderForStorage, ...ordersArr.filter((o: any) =>
      o?.reference !== order.reference)].slice(0, 50);
    localStorage.setItem('orders', JSON.stringify(updated));
    localStorage.setItem('current-order', JSON.stringify(orderForStorage));
  } catch (e) {
    console.warn('Failed to store order locally:', e);
  }
}

// Get stored order from local storage
export function getStoredOrder(reference: string): any | null {
  try {
    // Check current order first
    const storedOrder = localStorage.getItem('current-order');
    if (storedOrder) {
      const parsed = JSON.parse(storedOrder);
      if (parsed.reference === reference) {
        return parsed;
      }
    }

    // Check orders history
    const ordersStr = localStorage.getItem('orders');
    const ordersArr = Array.isArray(JSON.parse(ordersStr || 'null')) ?
      JSON.parse(ordersStr || '[]') : [];
    const found = ordersArr.find((o: any) => o?.reference === reference);

    return found || null;
  } catch (error) {
    console.error('Error parsing stored order:', error);
    return null;
  }
}

// Convert stored order to API format
export function storedOrderToApiFormat(storedOrder: any): any {
  return {
    reference: storedOrder.reference,
    status: storedOrder.status,
    total_amount: storedOrder.pricing.total,
    deposit_required: storedOrder.pricing.deposit_required,
    deposit_paid: storedOrder.pricing.deposit_paid,
    delivery_date: storedOrder.delivery.date,
    delivery_slot: storedOrder.delivery.slot,
    created_at: storedOrder.timestamps.createdAt,
    items: storedOrder.items.map((item: any) => ({
      product_name_snapshot: item.name,
      quantity: item.qty,
      portion_persons: 1,
      total_price: item.price * item.qty
    })),
    status_history: [{
      status: storedOrder.status,
      comment: 'Order created',
      changed_at: storedOrder.timestamps.createdAt
    }]
  };
}
