// Common validation patterns
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[\+]?[1-9][\d]{0,15}$/,
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  ALPHANUMERIC: /^[a-zA-Z0-9\s]+$/,
  FRENCH_TEXT: /^[a-zA-ZÀ-ÿ\s\-'.,!?()]+$/,
  PRICE: /^\d+(\.\d{1,2})?$/,
  INTEGER: /^\d+$/,
  UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
};

// Common validation messages
export const VALIDATION_MESSAGES = {
  REQUIRED: 'Ce champ est requis',
  EMAIL: 'Veuillez entrer une adresse email valide',
  PHONE: 'Veuillez entrer un numéro de téléphone valide',
  URL: 'Veuillez entrer une URL valide',
  MIN_LENGTH: (min: number) => `Minimum ${min} caractères requis`,
  MAX_LENGTH: (max: number) => `Maximum ${max} caractères autorisés`,
  PATTERN: 'Format invalide',
  NUMERIC: 'Veuillez entrer un nombre valide',
  POSITIVE: 'Veuillez entrer un nombre positif',
  INTEGER: 'Veuillez entrer un nombre entier',
  PASSWORD: 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial',
  FRENCH_TEXT: 'Veuillez utiliser uniquement des caractères français valides',
  PRICE: 'Veuillez entrer un prix valide',
  UUID: 'Format UUID invalide',
};
