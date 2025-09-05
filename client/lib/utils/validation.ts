// Validation utilities - Main composition file
// Re-export all types, constants, functions, and utilities for easy importing

// Re-export all types
export type {
  ValidationRule,
  ValidationResult,
  FieldValidation
} from './validation/types';

// Re-export constants
export {
  VALIDATION_PATTERNS,
  VALIDATION_MESSAGES
} from './validation/constants';

// Re-export core functions
export {
  validateField,
  validateForm,
  isFormValid,
  getFormErrors
} from './validation/core';

// Re-export schemas
export { COMMON_VALIDATION_SCHEMAS } from './validation/schemas';

// Re-export hooks
export { useFormValidation } from './validation/hooks';

// Re-export utilities
export {
  sanitizeInput,
  formatPhoneNumber,
  formatPrice,
  validateFileUpload
} from './validation/utilities';
