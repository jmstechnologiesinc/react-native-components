// Dates typed into a text field: `YYYY-MM-DD`, or `YYYY-MM-DD HH:mm`. Input
// formatting and parsing only; whether a date is acceptable (an expiry, an
// effective date) is the host's — the server's — to say.
//
// Two kinds of date, never mixed:
// - an INSTANT (epoch ms) typed in the user's local time: `formatDateInput` /
//   `parseDateInput`;
// - a CALENDAR DATE (a day, not an instant: an expiry, a birth date) kept as
//   the `YYYY-MM-DD` string itself: `formatCalendarDate` /
//   `parseCalendarDate`. It never goes through a `Date` in a time zone, so it
//   never lands on the previous day west of UTC.

const pad = (value) => String(value).padStart(2, '0');

export const DATE_PATTERN = 'YYYY-MM-DD';
export const DATE_TIME_PATTERN = 'YYYY-MM-DD HH:mm';

const DATE = /^(\d{4})-(\d{2})-(\d{2})$/;
const DATE_TIME = /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})$/;

/**
 * An instant as the user types it, in local time.
 *
 * @param {?number} millis epoch ms
 * @param {{withTime?: boolean}} [options]
 * @returns {string} '' when there is no instant
 */
export const formatDateInput = (millis, { withTime = false } = {}) => {
    if (typeof millis !== 'number' || !Number.isFinite(millis)) return '';
    const date = new Date(millis);
    const day = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    return withTime ? `${day} ${pad(date.getHours())}:${pad(date.getMinutes())}` : day;
};

/**
 * A typed local date (and time) as an instant.
 *
 * @param {string} text
 * @param {{withTime?: boolean}} [options]
 * @returns {?number} epoch ms, or null when the text is not a real date in the pattern
 */
export const parseDateInput = (text, { withTime = false } = {}) => {
    const match = (withTime ? DATE_TIME : DATE).exec(String(text ?? '').trim());
    if (!match) return null;
    const [year, month, day, hours = 0, minutes = 0] = match.slice(1).map(Number);
    const date = new Date(year, month - 1, day, hours, minutes);
    const sameDay = date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
    return sameDay && hours < 24 && minutes < 60 ? date.getTime() : null;
};

/**
 * A calendar date as `YYYY-MM-DD`, shown as it is.
 *
 * @param {?string} value
 * @returns {string} '' when it is not a `YYYY-MM-DD` string
 */
export const formatCalendarDate = (value) => {
    if (typeof value !== 'string') return '';
    const trimmed = value.trim();
    return DATE.test(trimmed) ? trimmed : '';
};

/**
 * A typed calendar date, read as a plain date with no time zone: `2029-09-25` stays `2029-09-25`.
 *
 * @param {string} text
 * @returns {?string} the `YYYY-MM-DD` date, or null when the text is not a real day in that pattern
 */
export const parseCalendarDate = (text) => {
    const trimmed = String(text ?? '').trim();
    const match = DATE.exec(trimmed);
    if (!match) return null;
    const [year, month, day] = match.slice(1).map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    const real = date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
    return real ? trimmed : null;
};
