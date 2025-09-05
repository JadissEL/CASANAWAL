// =====================================================
// PRODUCT MODAL TYPES & INTERFACES (≤150 lines)
// =====================================================

export interface Product {
  id: string;
  sku: string;
  base_price: number;
  category_id: string;
  category_name: string;
  product_name?: string;
  description?: string;
  is_active: boolean;
  is_vegetarian?: boolean;
  is_spicy?: boolean;
  is_featured?: boolean;
  prep_time_minutes?: number;
  sort_order?: number;
}

export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

export interface EnterpriseMessage {
  type: 'success' | 'error' | 'warning' | 'info';
  text: string;
  details?: string;
  duration?: number;
  requestId?: string;
}

export interface ProductEditModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: Partial<Product>) => Promise<void>;
  message?: EnterpriseMessage | null;
}

export interface StringValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  transform?: (v: string) => string;
}

export interface NumberValidationRule {
  required?: boolean;
  min?: number;
  max?: number;
  integer?: boolean;
  step?: number;
}

export type ValidationRule = StringValidationRule | NumberValidationRule;

export interface FormData {
  sku: string;
  product_name: string;
  description: string;
  base_price: string;
  prep_time_minutes: string;
  sort_order: string;
  is_active: boolean;
  is_vegetarian: boolean;
  is_spicy: boolean;
  is_featured: boolean;
}

export interface FormErrors {
  [key: string]: string;
}

export interface ValidationState {
  isValid: boolean;
  errors: ValidationError[];
  hasChanges: boolean;
}

export interface MonitoringState {
  validationTime: number;
  renderCount: number;
  lastValidation: Date;
  performanceMetrics: {
    validationDuration: number;
    renderDuration: number;
  };
}

export interface SecurityState {
  inputSanitized: boolean;
  xssProtected: boolean;
  csrfToken?: string;
  lastSecurityCheck: Date;
}

export interface EnterpriseState {
  monitoring: MonitoringState;
  security: SecurityState;
  validation: ValidationState;
}

export interface FieldProps {
  label: string;
  value: string | boolean;
  onChange: (value: string | boolean) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  type?: 'text' | 'number' | 'textarea' | 'checkbox';
  min?: number;
  max?: number;
  step?: number;
}

export interface StatusIndicatorProps {
  status: 'idle' | 'validating' | 'valid' | 'invalid' | 'saving' | 'saved' | 'error';
  message?: string;
  details?: string;
}

export interface PerformanceMetrics {
  validationTime: number;
  renderTime: number;
  totalOperations: number;
  averageResponseTime: number;
}

export interface SecurityMetrics {
  inputsSanitized: number;
  xssAttempts: number;
  validationsPassed: number;
  securityScore: number;
}
