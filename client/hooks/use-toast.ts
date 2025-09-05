// Toast hooks - Main composition file
// Re-export all types, constants, and hooks for easy importing

// Re-export all types
export type {
  ToasterToast,
  Toast,
  State,
  ActionType,
  Action
} from './use-toast/types';

// Re-export constants
export {
  TOAST_LIMIT,
  TOAST_REMOVE_DELAY
} from './use-toast/constants';

// Re-export state management
export { reducer } from './use-toast/state';

// Re-export main hook and toast function
export { useToast, toast } from './use-toast/hook';
