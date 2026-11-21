import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import enTranslation from './Translations/en.json';
import esTranslation from './Translations/es.json';
import { addFlatCatalog, catalogText, FALLBACK_LOCALE, SUPPORTED_LOCALES } from './catalog';

// The browser's language is only the default (W3C, «Language negotiation»): a page whose address names its language
// (`/us/es/terms`, the second segment) is shown in it, and only a choice the person makes is remembered. The detector
// reads the path, then a remembered choice, then the browser; it remembers nothing by itself (`caches: []`), so a
// visit to a Spanish page never turns the rest of the site Spanish. `supportedLngs` keeps a path segment that is not
// a language (`/rides/history`) from being taken for one. Not frozen: the detector writes its own defaults into the
// options it is given.
const DETECTION = {
    order: ['path', 'localStorage', 'navigator'],
    lookupFromPathIndex: 1,
    caches: [],
};

// Where a person's own choice of language is kept: the detector's localStorage key, read second in DETECTION.order.
const CHOSEN_LANGUAGE_CACHES = Object.freeze(['localStorage']);

// ADR-0017 §5.4 — the web twin, made a twin.
//
// §2.2 called these two «gemelos divergentes», and the divergence was not
// stylistic: this half had a real fallback chain and the native half did not,
// this half answered a missing key with i18next's own output and the native
// half with the key, and — the one that actually corrupts text — the two used
// DIFFERENT INTERPOLATION SYNTAX. i18next's default is `{{name}}`; `i18n-js`
// uses `%{name}`, and the narration catalogue is written in `%{name}` because
// it is also read by the server's `i18n`. Rendered here with the default
// syntax, every narration string would have shown its placeholders raw to the
// user: `%{vendor} is preparing your order`.
//
// So: the same tree through the same loader, the same `%{}` placeholders, the
// same answer for an absent key, the same `en` fallback.

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: enTranslation },
            es: { translation: esTranslation },
        },
        debug: false,
        fallbackLng: FALLBACK_LOCALE,
        supportedLngs: SUPPORTED_LOCALES,
        detection: DETECTION,

        interpolation: {
            escapeValue: false,
            // The catalogue's syntax, not the library's default.
            prefix: '%{',
            suffix: '}',
        },

        // The key itself, exactly as the native twin answers — but only when
        // there is no `defaultValue`: i18next calls this handler with
        // `(key, defaultValue)` for EVERY miss, so a handler that returns
        // `key` alone discards the narration text `localized` passes as the
        // default, and every narration string rendered as its own key.
        parseMissingKeyHandler: (key, defaultValue) => defaultValue ?? key,

        react: {
            useSuspense: false,
        },
    });

// The narration catalogue is flat and consulted by exact match (see
// `catalog.js`); i18next interpolates `defaultValue` exactly as it does a
// translation, so the two twins render the same string from the same key.
// `defaultValue` is applied LAST on purpose: it is this module's answer, not
// a caller's option to override.
export const localized = (key, config = {}) =>
    i18n.t(key, { ...config, defaultValue: catalogText(key, currentLocale()) ?? key });

export default i18n;

/**
 * The language i18next actually answers in. `language` is what the detector
 * read (`es-ES`); `resolvedLanguage` is the supported one it resolved to
 * (`es`), which is the one the catalogues are keyed by.
 */
export const currentLocale = () => i18n.resolvedLanguage || i18n.language || FALLBACK_LOCALE;

/**
 * Registers a flat `{ en: { key: text }, es: { … } }` catalogue, exactly as the
 * native twin does. It is ALSO added to i18next as a resource bundle, so a host
 * reading the same keys through `react-i18next` (`useTranslation`) gets the
 * same text; i18next resolves flat dotted keys by itself.
 */
export const registerFlatCatalog = (catalog) => {
    addFlatCatalog(catalog);
    for (const [locale, entries] of Object.entries(catalog || {})) {
        i18n.addResourceBundle(locale, 'translation', entries, true, true);
    }
};

// The native twin configures `i18n-js` on demand — the app and the stories
// call this before rendering. Here i18next is configured once, above, at
// import time, so the call has nothing left to do; it exists so both twins
// expose the same surface and a module that imports it resolves on the web
// too (webpack picks `.web.js` first, and a missing export is `undefined`
// there — `setI18nConfig is not a function` took down every Order story).
export const setI18nConfig = () => {};

/**
 * A language the person chose (a language selector), applied and remembered: the detector reads it back on the next
 * visit, after the address's own language and before the browser's. A visit is never remembered (DETECTION.caches);
 * only this call is.
 *
 * @param {string} language one of SUPPORTED_LOCALES
 * @returns {Promise} i18next's changeLanguage
 */
export const chooseLanguage = (language) => {
    i18n.services.languageDetector.cacheUserLanguage(language, CHOSEN_LANGUAGE_CACHES);
    return i18n.changeLanguage(language);
};
