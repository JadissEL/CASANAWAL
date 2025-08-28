import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import frTranslations from '../locales/fr.json';
import arTranslations from '../locales/ar.json';

// Initialize i18n with error handling
const initI18n = async () => {
  try {
    await i18n
      .use(LanguageDetector)
      .use(initReactI18next)
      .init({
        resources: {
          fr: {
            translation: frTranslations
          },
          ar: {
            translation: arTranslations
          }
        },
        lng: 'fr', // default language
        fallbackLng: 'fr',
        detection: {
          order: ['localStorage', 'navigator', 'htmlTag'],
          caches: ['localStorage'],
        },
        interpolation: {
          escapeValue: false
        },
        react: {
          useSuspense: false
        },
        debug: false
      });
  } catch (error) {
    console.warn('i18n initialization failed:', error);
  }
};

// Initialize immediately
initI18n();

export default i18n;
