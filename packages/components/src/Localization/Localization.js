import memoize from 'lodash.memoize';
import i18n from 'i18n-js';
import * as RNLocalize from 'react-native-localize';

import { narrationText, SUPPORTED_LOCALES, FALLBACK_LOCALE } from './catalog';

// ADR-0017 §5.4 and §6 — the native half of the language system.
//
// THREE DEFECTS §2.2 NAMED, AND HOW EACH IS FIXED HERE:
//
//   1. «carga un solo idioma (sin cadena de respaldo)». `setI18nConfig`
//      replaced `i18n.translations` with ONE locale's file, so a key present
//      in `en` and missing from `es` rendered as the raw key on a Spanish
//      device — the worst case, because nobody developing in English ever
//      sees it. Now both locales are installed and `fallbacks` is on with
//      `en` as the default: `es -> en` is a real chain, the one §5.4 asks
//      for.
//
//   2. «detecta la clave ausente buscando la subcadena `missing`». It tested
//      `i18n.t(key).includes('missing')`, a substring check against the
//      RENDERED TEXT: any legitimate translation containing that word («No
//      driver found» does not, but «missing items» does) was reported absent
//      and rendered as its own key. The API answer is `defaultValue`, which
//      `i18n-js` returns from `lookup` when — and only when — no translation
//      exists in any locale of the chain. The sentinel below carries no
//      `%{}` placeholder, so interpolation cannot alter it and the
//      comparison is exact.
//
//   3. «memoiza sin el locale». The memo key was the translation key alone,
//      so the first render after a language change served the previous
//      language from cache. The resolver now leads with `i18n.locale`. The
//      cache is still cleared by `setI18nConfig` — the app's own merge layer
//      depends on `localized.cache` — but correctness no longer rests on
//      remembering to.
//
// The web twin loads the same tree through the same loader and answers a
// missing key the same way: §2.2's «dos gemelos divergentes» is the defect
// both halves of this change exist to close.

export const translationGetters = {
    es: () => require('./Translations/es.json'),
    en: () => require('./Translations/en.json'),
};

// Absent from every locale of the chain. The sentinel is written as escapes
// on purpose — a literal control character in a source file is invisible to
// every reader and to every diff. It carries no `%{}` placeholder, so
// `i18n-js` hands it back untouched and the identity test below is exact.
const ABSENT = '\u0000absent\u0000';

export const localized = memoize(
    (key, config) => {
        // The narration catalogue is flat and is consulted by exact match
        // (see `catalog.js`); `i18n-js` interpolates a `defaultValue` exactly
        // as it interpolates a translation, so the placeholders, the locale
        // and the chain behave identically either way.
        const value = i18n.t(key, { ...config, defaultValue: narrationText(key, i18n.locale) ?? ABSENT });
        // The key itself, as before: a screen showing `order.receipt` is a
        // visible bug report, and the app's merge layer relies on it.
        return value === ABSENT ? key : value;
    },
    (key, config) => `${i18n.locale} ${key}${config ? JSON.stringify(config) : ''}`
);

export const setI18nConfig = () => {
    const best = RNLocalize.findBestLanguageTag(SUPPORTED_LOCALES);
    const languageTag = best?.languageTag || FALLBACK_LOCALE;
    localized.cache.clear();
    // BOTH locales, always — a fallback chain needs the fallback present.
    i18n.translations = Object.fromEntries(
        SUPPORTED_LOCALES.map((locale) => [locale, translationGetters[locale]()])
    );
    i18n.defaultLocale = FALLBACK_LOCALE;
    i18n.fallbacks = true;
    i18n.locale = languageTag;
};
