export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  email?: boolean;
  phone?: boolean;
  url?: boolean;
  numeric?: boolean;
  positive?: boolean;
  integer?: boolean;
  custom?: (value: any) => string | null;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface FieldValidation {
  [fieldName: string]: ValidationRule;
}
