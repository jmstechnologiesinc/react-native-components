import { formatCalendarDate, formatDateInput, isBlankDay, parseCalendarDate, parseDateInput, parseDay } from '..';

describe('instants typed in local time', () => {
    it('formats and parses a date, and a date with time', () => {
        const millis = new Date(2026, 9, 31, 9, 5).getTime();
        expect(formatDateInput(millis)).toBe('2026-10-31');
        expect(formatDateInput(millis, { withTime: true })).toBe('2026-10-31 09:05');
        expect(parseDateInput('2026-10-31')).toBe(new Date(2026, 9, 31).getTime());
        expect(parseDateInput(' 2026-10-31 09:05 ', { withTime: true })).toBe(millis);
    });

    it('refuses what is not a real date in the pattern', () => {
        expect(formatDateInput(undefined)).toBe('');
        expect(formatDateInput(Number.NaN)).toBe('');
        expect(parseDateInput('31/10/2026')).toBeNull();
        expect(parseDateInput('2026-02-30')).toBeNull();
        expect(parseDateInput('2026-10-31 24:00', { withTime: true })).toBeNull();
        expect(parseDateInput('2026-10-31 10:60', { withTime: true })).toBeNull();
    });
});

describe('calendar dates (no time zone round trip)', () => {
    it('keeps a YYYY-MM-DD string as it is', () => {
        expect(formatCalendarDate(' 2029-09-25 ')).toBe('2029-09-25');
        expect(parseCalendarDate('2029-09-25')).toBe('2029-09-25');
    });

    it('refuses what is not a real day, or not a string', () => {
        expect(formatCalendarDate('2029-09-25T00:00:00Z')).toBe('');
        expect(formatCalendarDate(1727222400000)).toBe('');
        expect(parseCalendarDate('2029-02-29')).toBeNull();
        expect(parseCalendarDate('2028-02-29')).toBe('2028-02-29');
        expect(parseCalendarDate(null)).toBeNull();
    });
});

describe('a typed day as a range', () => {
    it('reads a YYYY-MM-DD day as its first and last millisecond in local time', () => {
        expect(parseDay(' 2026-10-31 ')).toEqual({
            start: new Date(2026, 9, 31).getTime(),
            end: new Date(2026, 10, 1).getTime() - 1,
        });
    });

    it('refuses other formats and days that do not exist; says when the field is empty', () => {
        expect(parseDay('31/10/2026')).toBeNull();
        expect(parseDay('2026-02-30')).toBeNull();
        expect(parseDay('2026-10-31 10:00')).toBeNull();
        expect(parseDay(undefined)).toBeNull();
        expect(isBlankDay('  ')).toBe(true);
        expect(isBlankDay(undefined)).toBe(true);
        expect(isBlankDay('2026-01-01')).toBe(false);
    });
});
