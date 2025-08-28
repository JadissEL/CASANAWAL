import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

export const useLanguage = () => {
  const { i18n, t } = useTranslation();

  const currentLanguage = i18n?.language || 'fr';
  const isRTL = currentLanguage === 'ar';
  
  const changeLanguage = (lng: 'fr' | 'ar') => {
    if (i18n?.changeLanguage) {
      i18n.changeLanguage(lng);
    }
  };
  
  useEffect(() => {
    // Update document direction and lang
    document.documentElement.lang = currentLanguage;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    
    // Update body class for font switching
    document.body.className = document.body.className.replace(/\b(lang-fr|lang-ar)\b/g, '');
    document.body.classList.add(`lang-${currentLanguage}`);
  }, [currentLanguage, isRTL]);
  
  return {
    currentLanguage,
    isRTL,
    changeLanguage,
    t
  };
};

// Language direction utilities for Tailwind
export const getDirectionClass = (isRTL: boolean, ltrClass: string, rtlClass: string) => {
  return isRTL ? rtlClass : ltrClass;
};

// Common direction mappings
export const directionClasses = {
  textAlign: (isRTL: boolean) => isRTL ? 'text-right' : 'text-left',
  marginLeft: (isRTL: boolean) => isRTL ? 'me-' : 'ms-',
  marginRight: (isRTL: boolean) => isRTL ? 'ms-' : 'me-',
  paddingLeft: (isRTL: boolean) => isRTL ? 'pe-' : 'ps-',
  paddingRight: (isRTL: boolean) => isRTL ? 'ps-' : 'pe-',
  borderLeft: (isRTL: boolean) => isRTL ? 'border-e-' : 'border-s-',
  borderRight: (isRTL: boolean) => isRTL ? 'border-s-' : 'border-e-',
};
