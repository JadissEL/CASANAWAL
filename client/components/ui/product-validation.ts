// =====================================================
// PRODUCT VALIDATION RULES & LOGIC (≤150 lines)
// =====================================================

import { ValidationRule, ValidationError, FormData, Product } from "./product-modal-types";

// Règles de validation simplifiées (regex fixées)
export const VALIDATION_RULES: Record<string, ValidationRule> = {
  sku: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[A-Z0-9_-]+$/i,
    transform: (v: string) => v.trim().toUpperCase()
  },
  product_name: {
    required: true,
    minLength: 2,
    maxLength: 255,
    // Pattern simplifié pour éviter les problèmes d'échappement
    pattern: /^[a-zA-Z0-9\s\u00C0-\u017F\u0600-\u06FF\-'.,!?]+$/u
  },
  base_price: {
    required: true,
    min: 0,
    max: 9999.99,
    step: 0.01
  },
  prep_time_minutes: {
    required: true,
    min: 1,
    max: 999,
    integer: true
  },
  description: {
    maxLength: 2000
  },
  sort_order: {
    min: 0,
    max: 9999,
    integer: true
  }
};

// Fonction de validation sécurisée avec sanitisation
export const validateField = (field: string, value: any): ValidationError[] => {
  const errors: ValidationError[] = [];
  const rule = VALIDATION_RULES[field];
  
  if (!rule) return errors;

  // Sanitisation basique pour éviter XSS
  const sanitizedValue = typeof value === 'string' 
    ? value.replace(/<script[^>]*>.*?<\/script>/gi, '').trim()
    : value;

  // Validation required
  if ('required' in rule && rule.required && (!sanitizedValue || sanitizedValue === '')) {
    errors.push({
      field,
      message: `${field} est requis`,
      severity: 'error'
    });
    return errors;
  }

  if (!sanitizedValue && sanitizedValue !== 0) return errors;

  // Validation pour strings
  if ('minLength' in rule || 'maxLength' in rule || 'pattern' in rule) {
    const strValue = String(sanitizedValue);
    
    if ('minLength' in rule && rule.minLength && strValue.length < rule.minLength) {
      errors.push({
        field,
        message: `${field} doit contenir au moins ${rule.minLength} caractères`,
        severity: 'error'
      });
    }
    
    if ('maxLength' in rule && rule.maxLength && strValue.length > rule.maxLength) {
      errors.push({
        field,
        message: `${field} ne peut pas dépasser ${rule.maxLength} caractères`,
        severity: 'error'
      });
    }
    
    if ('pattern' in rule && rule.pattern && !rule.pattern.test(strValue)) {
      errors.push({
        field,
        message: `Format de ${field} invalide`,
        severity: 'error'
      });
    }
  }

  // Validation pour numbers
  if ('min' in rule || 'max' in rule || 'integer' in rule) {
    const numValue = Number(sanitizedValue);
    
    if (isNaN(numValue)) {
      errors.push({
        field,
        message: `${field} doit être un nombre valide`,
        severity: 'error'
      });
      return errors;
    }
    
    if ('min' in rule && rule.min !== undefined && numValue < rule.min) {
      errors.push({
        field,
        message: `${field} ne peut pas être inférieur à ${rule.min}`,
        severity: 'error'
      });
    }
    
    if ('max' in rule && rule.max !== undefined && numValue > rule.max) {
      errors.push({
        field,
        message: `${field} ne peut pas être supérieur à ${rule.max}`,
        severity: 'error'
      });
    }
    
    if ('integer' in rule && rule.integer && !Number.isInteger(numValue)) {
      errors.push({
        field,
        message: `${field} doit être un nombre entier`,
        severity: 'error'
      });
    }
  }

  return errors;
};

// Form validation and transformation functions moved to product-validation-utils.ts
