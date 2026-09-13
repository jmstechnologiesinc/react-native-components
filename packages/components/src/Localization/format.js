import i18n from 'i18n-js';

import { FALLBACK_LOCALE } from './catalog';

// ADR-0017 §6.2 — «Formato local con `Intl`».
//
// §2.2: «no usa `Intl` en ningún sitio: las fechas van por `toLocaleString()`
// con el locale del dispositivo, no el de la app». Those are two different
// locales and the gap is visible: a user whose phone is in English and whose
// app is in Spanish was reading Spanish prose with English dates. `Intl` is in
// Hermes on RN 0.75+, so this needs no library — only the app's locale, which
// `i18n.locale` holds.
//
// Every formatter answers `null` for an absent or unparseable instant instead
// of «Invalid Date», because a screen can render nothing but cannot render a
// lie.

const localeTag = () => i18n.locale || FALLBACK_LOCALE;

const asDate = (value) => {
    if (!value) return null;
    const date = value instanceof Date ? value : new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
};

/** Date and time in the app's locale — the replacement for `toLocaleString()`. */
export const formatDateTime = (value, options = { dateStyle: 'medium', timeStyle: 'short' }) => {
    const date = asDate(value);
    return date ? new Intl.DateTimeFormat(localeTag(), options).format(date) : null;
};

/** Just the clock time: «6:42 p. m.» / «6:42 PM». What an ETA reads as. */
export const formatTime = (value) => formatDateTime(value, { timeStyle: 'short' });

/**
 * «en 8 min» / «in 8 min», from an absolute instant.
 *
 * The narration ships ETAs as instants and never as minutes, precisely so the
 * countdown is computed against the reader's clock at the moment it is drawn
 * (`describeOrder`: «A package that computed minutes would freeze them at the
 * moment it was called»). This is the other end of that contract.
 */
export const formatRelativeTime = (value, now = Date.now()) => {
    const date = asDate(value);
    if (!date) return null;

    const seconds = Math.round((date.getTime() - now) / 1000);
    const formatter = new Intl.RelativeTimeFormat(localeTag(), { numeric: 'auto', style: 'short' });
    const absolute = Math.abs(seconds);

    if (absolute < 60) return formatter.format(seconds, 'second');
    if (absolute < 3600) return formatter.format(Math.round(seconds / 60), 'minute');
    if (absolute < 86400) return formatter.format(Math.round(seconds / 3600), 'hour');
    return formatter.format(Math.round(seconds / 86400), 'day');
};
