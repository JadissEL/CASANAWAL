import type { ValidationResult } from './types';

// Utility functions
export function sanitizeInput(input: string): string {
  return input.trim().replace(/\s+/g, ' ');
}

export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/);
  if (match) {
    return `${match[1]} ${match[2]} ${match[3]} ${match[4]} ${match[5]}`;
  }
  return phone;
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(price);
}

export function validateFileUpload(
  file: File,
  maxSize: number = 5 * 1024 * 1024, // 5MB
  allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/webp']
): ValidationResult {
  const errors: string[] = [];

  if (file.size > maxSize) {
    errors.push(`Le fichier est trop volumineux. Taille maximum: ${Math.round(maxSize / 1024 / 1024)}MB`);
  }

  if (!allowedTypes.includes(file.type)) {
    errors.push(`Type de fichier non autorisé. Types acceptés: ${allowedTypes.join(', ')}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
