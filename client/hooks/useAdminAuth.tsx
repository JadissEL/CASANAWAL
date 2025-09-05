// Admin Auth hooks - Main composition file
// Re-export all types, context, and hooks for easy importing

// Re-export all types
export type { AdminUser, AuthContextType } from './useAdminAuth/types';

// Re-export service instance for direct use if needed
export { authService } from './useAdminAuth/service';

// Re-export context and hooks
export {
  AdminAuthProvider,
  useAdminAuth,
  RequireAuth,
  useChangePassword
} from './useAdminAuth/context';
