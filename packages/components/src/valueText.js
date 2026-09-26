// Any served value as display text, uninterpreted: `null`, absent or '' as an
// em dash, a list as its items joined, an object as JSON, anything else as its
// string. For values shown as given (extracted fields, table cells, a
// simulator's output), never for anything decided on.

/** What an absent value shows as. */
export const EMPTY_VALUE = '—';

/** @param {*} value @returns {string} */
export const valueText = (value) => {
    if (value === undefined || value === null || value === '') return EMPTY_VALUE;
    if (Array.isArray(value)) return value.length ? value.map(valueText).join(', ') : EMPTY_VALUE;
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
};

export default valueText;
