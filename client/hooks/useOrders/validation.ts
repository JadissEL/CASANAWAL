// Order validation utilities
export function useOrderValidation() {
  const validateOrderReference = (ref: string): boolean => {
    const refPattern = /^NAW-\d{8}-[A-Z0-9]{4,8}$/;
    return refPattern.test(ref.trim().toUpperCase());
  };

  const generateOrderReference = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `NAW-${year}${month}${day}-${random}`;
  };

  return {
    validateOrderReference,
    generateOrderReference
  };
}

