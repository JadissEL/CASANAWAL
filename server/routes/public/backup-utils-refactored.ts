// =====================================================
// BACKUP UTILS REFACTORED - MAIN EXPORT (≤50 lines)
// =====================================================
// This file demonstrates the refactored version of utils-original-backup.ts
// following prompt.md Phase 1: File Splitting requirements

// Export all route handlers from their respective modules
export { getPublicSettings, getSetting, getSettings } from './backup-settings-handlers';
export { getDeliveryZones } from './backup-delivery-handlers';
export { getAvailableTimeSlots, checkSlotAvailability } from './backup-timeslots-handlers';
export { validatePromoCode, calculatePromoDiscount } from './backup-promo-handlers';
export { getContactInfo, isRestaurantOpen } from './backup-contact-handlers';
export { trackActivity, getAnalyticsSummary } from './backup-analytics-handlers';
