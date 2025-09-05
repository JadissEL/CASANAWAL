export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationData {
  current_page: number;
  per_page: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}
