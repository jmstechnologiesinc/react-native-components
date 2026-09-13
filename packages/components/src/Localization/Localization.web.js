import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import enTranslation from './Translations/en.json';
import esTranslation from './Translations/es.json';
import { narrationText, FALLBACK_LOCALE } from './catalog';

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

        interpolation: {
            escapeValue: false,
            // The catalogue's syntax, not the library's default.
            prefix: '%{',
            suffix: '}',
        },

        // The key itself, exactly as the native twin answers.
        parseMissingKeyHandler: (key) => key,

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
    i18n.t(key, { ...config, defaultValue: narrationText(key, i18n.language) ?? key });

export default i18n;
