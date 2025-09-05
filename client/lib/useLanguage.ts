// Simplified language hook for French-only application
export const useLanguage = () => {
  return {
    isRTL: false, // French is LTR
    language: 'fr',
    setLanguage: () => {} // No-op since we only support French
  };
};
