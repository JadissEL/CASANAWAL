import type { ValidationRule, ValidationResult, FieldValidation } from './types';
import { VALIDATION_PATTERNS, VALIDATION_MESSAGES } from './constants';

// Main validation function
export function validateField(value: any, rules: ValidationRule): ValidationResult {
  const errors: string[] = [];

  // Required validation
  if (rules.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
    errors.push(VALIDATION_MESSAGES.REQUIRED);
    return { isValid: false, errors };
  }

  // Skip other validations if value is empty and not required
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return { isValid: true, errors: [] };
  }

  const stringValue = String(value);

  // Length validations
  if (rules.minLength && stringValue.length < rules.minLength) {
    errors.push(VALIDATION_MESSAGES.MIN_LENGTH(rules.minLength));
  }

  if (rules.maxLength && stringValue.length > rules.maxLength) {
    errors.push(VALIDATION_MESSAGES.MAX_LENGTH(rules.maxLength));
  }

  // Pattern validations
  if (rules.email && !VALIDATION_PATTERNS.EMAIL.test(stringValue)) {
    errors.push(VALIDATION_MESSAGES.EMAIL);
  }

  if (rules.phone && !VALIDATION_PATTERNS.PHONE.test(stringValue)) {
    errors.push(VALIDATION_MESSAGES.PHONE);
  }

  if (rules.url && !VALIDATION_PATTERNS.URL.test(stringValue)) {
    errors.push(VALIDATION_MESSAGES.URL);
  }

  if (rules.integer && !VALIDATION_PATTERNS.INTEGER.test(stringValue)) {
    errors.push(VALIDATION_MESSAGES.INTEGER);
  }

  if (rules.pattern && !rules.pattern.test(stringValue)) {
    errors.push(VALIDATION_MESSAGES.PATTERN);
  }

  // Numeric validations
  if (rules.numeric) {
    const numValue = Number(value);
    if (isNaN(numValue)) {
      errors.push(VALIDATION_MESSAGES.NUMERIC);
    } else if (rules.positive && numValue <= 0) {
      errors.push(VALIDATION_MESSAGES.POSITIVE);
    }
  }

  // Custom validation
  if (rules.custom) {
    const customError = rules.custom(value);
    if (customError) {
      errors.push(customError);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Validate entire form
export function validateForm(data: Record<string, any>, validationSchema: FieldValidation): Record<string, ValidationResult> {
  const results: Record<string, ValidationResult> = {};

  Object.keys(validationSchema).forEach(fieldName => {
    const value = data[fieldName];
    const rules = validationSchema[fieldName];
    results[fieldName] = validateField(value, rules);
  });

  return results;
}

// Check if form is valid
export function isFormValid(validationResults: Record<string, ValidationResult>): boolean {
  return Object.values(validationResults).every(result => result.isValid);
}

// Get all form errors
export function getFormErrors(validationResults: Record<string, ValidationResult>): string[] {
  const errors: string[] = [];
  Object.values(validationResults).forEach(result => {
    errors.push(...result.errors);
  });
  return errors;
}
