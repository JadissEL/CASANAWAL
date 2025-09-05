import { BaseAPIService } from './base-service';
import type {
  APIResponse,
  Order,
  OrderItem,
  GetOrdersParams,
  CreateOrderData,
  PaymentData
} from './types';

export class OrdersAPIService extends BaseAPIService {
  async createOrder(orderData: CreateOrderData): Promise<APIResponse<Order>> {
    return this.request<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getOrderByReference(reference: string): Promise<APIResponse<Order>> {
    return this.request<Order>(`/public/orders/${reference}`);
  }

  async getOrders(params?: GetOrdersParams): Promise<APIResponse<Order[]>> {
    const searchParams = new URLSearchParams();

    if (params?.status) searchParams.set('status', params.status);
    if (params?.client_id) searchParams.set('client_id', params.client_id);
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.start_date) searchParams.set('start_date', params.start_date);
    if (params?.end_date) searchParams.set('end_date', params.end_date);

    const query = searchParams.toString();
    return this.request<Order[]>(`/orders${query ? `?${query}` : ''}`);
  }

  async getOrder(id: string): Promise<APIResponse<Order>> {
    return this.request<Order>(`/orders/${id}`);
  }

  async updateOrderStatus(
    id: string,
    status: Order['status'],
    comment?: string
  ): Promise<APIResponse<Order>> {
    return this.request<Order>(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, comment }),
    });
  }

  async recordPayment(
    orderId: string,
    paymentData: PaymentData
  ): Promise<APIResponse<Order>> {
    return this.request<Order>(`/orders/${orderId}/payments`, {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }
}

export const ordersAPIService = new OrdersAPIService();
