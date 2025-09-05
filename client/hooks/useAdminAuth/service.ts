import type { AdminUser } from './types';

const AUTH_TOKEN_KEY = 'admin_token';
const AUTH_USER_KEY = 'admin_user';

export class AdminAuthService {
  private baseURL = '/api';

  async login(email: string, password: string): Promise<{
    user: AdminUser;
    token: string;
  }> {
    const response = await fetch(`${this.baseURL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    if (!data.success || !data.data) {
      throw new Error('Invalid response from server');
    }

    return data.data;
  }

  async getProfile(token: string): Promise<AdminUser> {
    const response = await fetch(`${this.baseURL}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to get profile');
    }

    return data.data;
  }

  async changePassword(token: string, currentPassword: string, newPassword: string): Promise<void> {
    const response = await fetch(`${this.baseURL}/auth/change-password`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to change password');
    }
  }

  setAuthData(user: AdminUser, token: string): void {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  }

  getAuthData(): { user: AdminUser | null; token: string | null } {
    try {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      const userStr = localStorage.getItem(AUTH_USER_KEY);

      if (!token || !userStr) {
        return { user: null, token: null };
      }

      const user = JSON.parse(userStr);
      return { user, token };
    } catch (error) {
      console.error('Error parsing auth data:', error);
      this.clearAuthData();
      return { user: null, token: null };
    }
  }

  clearAuthData(): void {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
  }

  isTokenValid(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Date.now() / 1000;
      return payload.exp > now;
    } catch (error) {
      return false;
    }
  }
}

export const authService = new AdminAuthService();
