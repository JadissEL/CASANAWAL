import { VALIDATION_PATTERNS } from './constants';
import type { FieldValidation } from './types';

// Common validation schemas
export const COMMON_VALIDATION_SCHEMAS: Record<string, FieldValidation[string]> = {
  EMAIL: {
    required: true,
    email: true,
    maxLength: 255,
  },

  PASSWORD: {
    required: true,
    minLength: 8,
    pattern: VALIDATION_PATTERNS.PASSWORD,
  },

  NAME: {
    required: true,
    minLength: 2,
    maxLength: 100,
    pattern: VALIDATION_PATTERNS.FRENCH_TEXT,
  },

  PHONE: {
    required: true,
    phone: true,
  },

  PRICE: {
    required: true,
    numeric: true,
    positive: true,
    pattern: VALIDATION_PATTERNS.PRICE,
  },

  QUANTITY: {
    required: true,
    numeric: true,
    positive: true,
    integer: true,
  },

  URL: {
    required: false,
    url: true,
  },

  DESCRIPTION: {
    required: false,
    maxLength: 1000,
  },

  ADDRESS: {
    required: true,
    minLength: 10,
    maxLength: 200,
  },

  POSTAL_CODE: {
    required: true,
    pattern: /^\d{5}$/,
  },
} as const;
