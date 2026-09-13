import { EN as NARRATION_EN, ES as NARRATION_ES } from '@jmstechnologiesinc/order-narration';

// ADR-0017 §6.3 — ONE SOURCE, TWO CONSUMERS.
//
// The narration catalogues live in `@jmstechnologiesinc/order-narration`
// (D-51: its own package, because the vocabulary is shared by this package and
// by the server's `locales/`). This module is the seam where they meet the
// component library's own strings, and it exists so the native twin
// (`Localization.js`, `i18n-js`) and the web twin (`Localization.web.js`,
// `i18next`) resolve EXACTLY the same keys the same way. §2.2 called the two
// «gemelos divergentes»; a shared loader is what stops them diverging again.
//
// WHY THE NARRATION CATALOGUE IS NOT MERGED INTO THE TREE, which is the one
// non-obvious decision in this file. Both i18n libraries resolve a scope by
// SPLITTING it on `.` and walking a nested object. The narration's keys are
// flat and dotted — and, by design, a headline key is a PREFIX of its own
// detail and of its own variants:
//
//     order.message.placed.any.customer          «Order sent to %{vendor}»
//     order.message.placed.any.customer.detail   «You'll know as soon as …»
//
// Nested, those two cannot coexist: `customer` is a leaf and a branch at once,
// and whichever is written second silently destroys the other. That is not a
// flaw in the catalogue — the flat form is deliberate, because the same file
// is read by a server that does not use `i18n-js` — so the fix is to stop
// pretending it is a tree. A narration key is looked up by EXACT MATCH in the
// flat map, and handed to the i18n library as its `defaultValue`, which both
// libraries interpolate exactly as they would a translation. The libraries
// keep doing the interpolation, the locale and the fallback; they simply stop
// being asked to navigate a shape the catalogue does not have.

export const SUPPORTED_LOCALES = Object.freeze(['es', 'en']);
export const FALLBACK_LOCALE = 'en';

const NARRATION = Object.freeze({
    en: NARRATION_EN,
    es: NARRATION_ES,
});

/**
 * The narration string for a key, in this locale, with the `es -> en` chain
 * applied — or `null` when the key is not the narration's.
 *
 * Returning `null` rather than the key is what lets the caller tell «the
 * narration does not own this key» (look in the library's own catalogue) apart
 * from «nobody owns it» (show the key).
 */
export const narrationText = (key, locale) =>
    NARRATION[locale]?.[key] ?? NARRATION[FALLBACK_LOCALE]?.[key] ?? null;

/** Deep merge, `extra` winning at the leaves — the shape the library's own
 *  nested catalogues have, and the same semantics the app uses to add its
 *  strings on top (`installAppTranslations`). */
export const merge = (base, extra) => {
    const out = { ...(base || {}) };
    for (const [key, value] of Object.entries(extra || {})) {
        out[key] = value && typeof value === 'object' && !Array.isArray(value) ? merge(out[key], value) : value;
    }
    return out;
};

export { NARRATION };
