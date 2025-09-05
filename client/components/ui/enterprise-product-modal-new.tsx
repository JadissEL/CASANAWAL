// =====================================================
// ENTERPRISE PRODUCT MODAL MAIN EXPORT (≤50 lines)
// =====================================================

// Export main component and types
export { ProductModalCore as ProductEditModal } from "./product-modal-core";

// Export all types for external use
export type {
  Product,
  ProductEditModalProps,
  ValidationError,
  EnterpriseMessage,
  FormData,
  ValidationRule,
  StringValidationRule,
  NumberValidationRule,
  StatusIndicatorProps,
  PerformanceMetrics,
  SecurityMetrics
} from "./product-modal-types";

// Export validation utilities
export { validateField, VALIDATION_RULES } from "./product-validation";
export { validateForm, sanitizeInput, transformFormData } from "./product-validation-utils";

// Export form components
export {
  FormField,
  PriceField,
  TimeField,
  TextAreaField,
  CheckboxField,
  SKUField,
  ProductNameField,
  SortOrderField
} from "./product-form-fields";

// Export header components
export {
  StatusIndicator,
  EnterpriseMetrics,
  ModalHeader,
  MessageAlert
} from "./product-modal-header";

// Default export
export { ProductModalCore as default } from "./product-modal-core";
