import React, { createContext, useContext, ReactNode } from 'react';
import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AdminUser, AuthContextType } from './types';
import { authService } from './service';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<{
    user: AdminUser | null;
    token: string | null;
    isInitialized: boolean;
  }>({
    user: null,
    token: null,
    isInitialized: false,
  });

  const queryClient = useQueryClient();

  // Initialize auth state from localStorage
  useEffect(() => {
    const { user, token } = authService.getAuthData();

    if (token && authService.isTokenValid(token)) {
      setAuthState({
        user,
        token,
        isInitialized: true,
      });
    } else {
      authService.clearAuthData();
      setAuthState({
        user: null,
        token: null,
        isInitialized: true,
      });
    }
  }, []);

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authService.login(email, password),
    onSuccess: (data) => {
      authService.setAuthData(data.user, data.token);
      setAuthState({
        user: data.user,
        token: data.token,
        isInitialized: true,
      });
      queryClient.clear(); // Clear all cached data
    },
  });

  // Profile query to keep user data fresh
  const { data: profileData } = useQuery({
    queryKey: ['adminProfile'],
    queryFn: () => authService.getProfile(authState.token!),
    enabled: !!authState.token,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      // Don't retry if unauthorized
      if (error?.message?.includes('401') || error?.message?.includes('Invalid token')) {
        logout();
        return false;
      }
      return failureCount < 2;
    },
  });

  // Update user data when profile query succeeds
  useEffect(() => {
    if (profileData && authState.token) {
      authService.setAuthData(profileData, authState.token);
      setAuthState(prev => ({
        ...prev,
        user: profileData,
      }));
    }
  }, [profileData, authState.token]);

  const login = async (email: string, password: string) => {
    await loginMutation.mutateAsync({ email, password });
  };

  const logout = () => {
    authService.clearAuthData();
    setAuthState({
      user: null,
      token: null,
      isInitialized: true,
    });
    queryClient.clear();
  };

  const hasPermission = (permission: string): boolean => {
    if (!authState.user) return false;
    if (authState.user.role === 'super_admin') return true;

    const permissions = authState.user.permissions || {};
    return !!permissions[permission];
  };

  const hasRole = (roles: string[]): boolean => {
    if (!authState.user) return false;
    return roles.includes(authState.user.role);
  };

  const value: AuthContextType = {
    user: authState.user,
    token: authState.token,
    isAuthenticated: !!authState.user && !!authState.token,
    isLoading: !authState.isInitialized || loginMutation.isPending,
    login,
    logout,
    hasPermission,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAdminAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}

// Protected route component
export function RequireAuth({ children, roles }: { children: ReactNode; roles?: string[] }) {
  const { isAuthenticated, hasRole, isLoading } = useAdminAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-terracotta border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-nuit-600">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    window.location.href = '/admin/login';
    return null;
  }

  if (roles && !hasRole(roles)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-nuit-900 mb-4">Accès refusé</h1>
          <p className="text-nuit-600 mb-4">
            Vous n'avez pas les permissions nécessaires pour accéder à cette page.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// Hook for change password
export function useChangePassword() {
  const { token } = useAdminAuth();

  return useMutation({
    mutationFn: ({ currentPassword, newPassword }: {
      currentPassword: string;
      newPassword: string;
    }) => {
      if (!token) throw new Error('Not authenticated');
      return authService.changePassword(token, currentPassword, newPassword);
    },
  });
}
