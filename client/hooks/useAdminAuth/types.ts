export interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: 'super_admin' | 'content_manager' | 'order_manager';
  permissions: any;
  created_at: string;
  last_login?: string;
  is_active: boolean;
}

export interface AuthContextType {
  user: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  hasRole: (roles: string[]) => boolean;
}
