// A typed `YYYY-MM-DD` day as a range of instants, on top of `dateInput.js`
// (the one parser of typed dates): a date filter or an «until» date covers the
// whole local day. Input parsing only.
import { parseDateInput } from './dateInput';

/**
 * @param {string} text
 * @returns {?{start: number, end: number}} the first and last millisecond of that local day (epoch ms), or
 *     null when the text is not a real `YYYY-MM-DD` day
 */
export const parseDay = (text) => {
    const start = parseDateInput(text);
    if (start === null) return null;
    // The next midnight, not start + 24 h: a day with a DST change is 23 or 25 hours long.
    const next = new Date(start);
    next.setDate(next.getDate() + 1);
    return { start, end: next.getTime() - 1 };
};

/** Whether the field is empty (an optional date field accepts that). */
export const isBlankDay = (text) => !String(text ?? '').trim();
