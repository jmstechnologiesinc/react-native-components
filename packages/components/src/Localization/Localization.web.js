import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import enTranslation from './Translations/en.json';
import esTranslation from './Translations/es.json';

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: enTranslation },
            es: { translation: esTranslation },
        },
        debug: false,
        fallbackLng: 'en',

        interpolation: {
            escapeValue: false,
        },

        react: {
            useSuspense: false,
        },
    });

export const localized = (key, config = {}) => i18n.t(key, config);

export default i18n;
