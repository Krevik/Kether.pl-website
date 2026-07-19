import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslations from './locales/en.json';
import plTranslations from './locales/pl.json';
import szlTranslations from './locales/szl.json';

const resources = {
    en: {
        translation: enTranslations,
    },
    pl: {
        translation: plTranslations,
    },
    szl: {
        translation: szlTranslations,
    },
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        supportedLngs: ['en', 'pl', 'szl'],
        nonExplicitSupportedLngs: true,
        fallbackLng: {
            szl: ['pl', 'en'],
            default: ['en'],
        },
        debug: process.env.NODE_ENV === 'development',

        interpolation: {
            escapeValue: false, // React already escapes values
        },

        detection: {
            order: ['localStorage', 'navigator', 'htmlTag'],
            caches: ['localStorage'],
            lookupLocalStorage: 'i18nextLng',
        },

        react: {
            useSuspense: false, // We'll handle Suspense ourselves
        },
    });

export default i18n;
