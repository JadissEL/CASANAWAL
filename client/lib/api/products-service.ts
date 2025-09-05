import { BaseAPIService } from './base-service';
import type { APIResponse, Product, GetProductsParams } from './types';

export class ProductsAPIService extends BaseAPIService {
  async getProducts(params?: GetProductsParams): Promise<APIResponse<Product[]>> {
    const searchParams = new URLSearchParams();

    if (params?.category_id) searchParams.set('category_id', params.category_id);
    if (params?.featured) searchParams.set('featured', 'true');
    if (params?.active !== undefined) searchParams.set('active', params.active.toString());
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());

    const query = searchParams.toString();
    return this.request<Product[]>(`/products${query ? `?${query}` : ''}`);
  }

  async getProduct(id: string): Promise<APIResponse<Product>> {
    return this.request<Product>(`/products/${id}`);
  }

  async searchProducts(query: string): Promise<APIResponse<Product[]>> {
    return this.request<Product[]>(`/products/search?q=${encodeURIComponent(query)}`);
  }
}

export const productsAPIService = new ProductsAPIService();
