import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// Import translation files
import enTranslations from './locales/en.json';
import plTranslations from './locales/pl.json';

const resources = {
    en: {
        translation: enTranslations,
    },
    pl: {
        translation: plTranslations,
    },
};

i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        debug: process.env.NODE_ENV === 'development',
        
        interpolation: {
            escapeValue: false, // React already escapes values
        },
        
        detection: {
            order: ['localStorage', 'navigator', 'htmlTag'],
            caches: ['localStorage'],
            lookupLocalStorage: 'i18nextLng',
        },
        
        backend: {
            loadPath: '/locales/{{lng}}/{{ns}}.json',
        },
        
        react: {
            useSuspense: false, // We'll handle Suspense ourselves
        },
    });

export default i18n;
