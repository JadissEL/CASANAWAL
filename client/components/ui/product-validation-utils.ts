// =====================================================
// PRODUCT VALIDATION UTILITIES (≤150 lines)
// =====================================================

import { ValidationError, FormData, Product } from "./product-modal-types";
import { validateField, VALIDATION_RULES } from "./product-validation";

export const validateForm = (formData: FormData): ValidationError[] => {
  const allErrors: ValidationError[] = [];
  
  // Valider chaque champ
  Object.keys(formData).forEach(field => {
    const fieldErrors = validateField(field, formData[field as keyof FormData]);
    allErrors.push(...fieldErrors);
  });

  return allErrors;
};

export const sanitizeInput = (input: string): string => {
  return input
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .trim();
};

export const transformFormData = (formData: FormData): Partial<Product> => {
  const transformed: Partial<Product> = {};
  
  // Appliquer les transformations définies dans les règles
  Object.keys(formData).forEach(field => {
    const rule = VALIDATION_RULES[field];
    let value = formData[field as keyof FormData];
    
    if (typeof value === 'string' && 'transform' in rule && rule.transform) {
      value = rule.transform(value);
    }
    
    // Conversion de types appropriée
    if (field === 'base_price' || field === 'prep_time_minutes' || field === 'sort_order') {
      (transformed as any)[field] = value === '' ? null : Number(value);
    } else {
      (transformed as any)[field] = value;
    }
  });
  
  return transformed;
};

export const validateAndTransform = (formData: FormData): {
  isValid: boolean;
  errors: ValidationError[];
  transformedData: Partial<Product>;
} => {
  const errors = validateForm(formData);
  const transformedData = transformFormData(formData);
  
  return {
    isValid: errors.length === 0,
    errors,
    transformedData
  };
};

export const getFieldValidationStatus = (field: string, value: any): {
  isValid: boolean;
  errors: ValidationError[];
  sanitizedValue: any;
} => {
  const errors = validateField(field, value);
  const sanitizedValue = typeof value === 'string' ? sanitizeInput(value) : value;
  
  return {
    isValid: errors.length === 0,
    errors,
    sanitizedValue
  };
};

export const createValidationSummary = (errors: ValidationError[]): {
  errorCount: number;
  warningCount: number;
  infoCount: number;
  criticalFields: string[];
  summary: string;
} => {
  const errorCount = errors.filter(e => e.severity === 'error').length;
  const warningCount = errors.filter(e => e.severity === 'warning').length;
  const infoCount = errors.filter(e => e.severity === 'info').length;
  const criticalFields = errors
    .filter(e => e.severity === 'error')
    .map(e => e.field);
  
  let summary = '';
  if (errorCount > 0) {
    summary = `${errorCount} erreur(s)`;
  } else if (warningCount > 0) {
    summary = `${warningCount} avertissement(s)`;
  } else if (infoCount > 0) {
    summary = `${infoCount} information(s)`;
  } else {
    summary = 'Validation réussie';
  }
  
  return {
    errorCount,
    warningCount,
    infoCount,
    criticalFields,
    summary
  };
};
