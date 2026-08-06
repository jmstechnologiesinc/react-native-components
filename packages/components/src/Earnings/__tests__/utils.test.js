import {
    EARNINGS_RANGES,
    MIN_BAR_RATIO,
    barRatio,
    isEmptyRange,
    peakValue,
    rangeLabelKeyOf,
    toBars,
} from '../utils';

const bucket = (value) => ({ key: '2026-08-03', label: 'Mon', value, formattedValue: '$0.00' });

// A week with one good day and one blank day: the shape every other case is measured against.
const WEEK = [bucket(6230), bucket(0), bucket(12460)];

describe('peakValue', () => {
    it('returns the tallest bucket', () => {
        expect(peakValue(WEEK)).toBe(12460);
    });

    it('returns 0 for an absent or empty range', () => {
        expect(peakValue(undefined)).toBe(0);
        expect(peakValue([])).toBe(0);
    });

    it('treats a missing or non-numeric value as 0', () => {
        expect(peakValue([{ label: 'Mon' }, bucket(500)])).toBe(500);
        expect(peakValue([bucket(null), bucket(300)])).toBe(300);
    });

    it('never goes negative, so it is safe as a denominator', () => {
        expect(peakValue([bucket(-800)])).toBe(0);
    });
});

describe('barRatio', () => {
    it('is proportional to the peak', () => {
        expect(barRatio(bucket(6230), 12460)).toBe(0.5);
        expect(barRatio(bucket(12460), 12460)).toBe(1);
    });

    it('falls back to the stub when the whole range is zero', () => {
        expect(barRatio(bucket(0), 0)).toBe(MIN_BAR_RATIO);
    });

    it('keeps a zero day visible', () => {
        expect(barRatio(bucket(0), 12460)).toBe(MIN_BAR_RATIO);
    });

    it('floors a negative bucket instead of inverting the bar', () => {
        expect(barRatio(bucket(-800), 12460)).toBe(MIN_BAR_RATIO);
    });
});

describe('toBars', () => {
    it('keeps the bucket fields and adds the geometry', () => {
        const [first] = toBars(WEEK);

        expect(first.label).toBe('Mon');
        expect(first.formattedValue).toBe('$0.00');
        expect(first.ratio).toBe(0.5);
    });

    it('marks the peak so the chart can highlight it', () => {
        expect(toBars(WEEK).map((bar) => bar.isPeak)).toEqual([false, false, true]);
    });

    it('marks no peak when nothing was earned', () => {
        expect(toBars([bucket(0), bucket(0)]).every((bar) => bar.isPeak === false)).toBe(true);
    });

    it('survives an absent range', () => {
        expect(toBars(undefined)).toEqual([]);
    });
});

describe('isEmptyRange', () => {
    it('is false as soon as one day earned something', () => {
        expect(isEmptyRange(WEEK)).toBe(false);
    });

    it('is true for a week of zeros', () => {
        expect(isEmptyRange([bucket(0), bucket(0)])).toBe(true);
    });

    it('is true when there are no buckets at all', () => {
        expect(isEmptyRange([])).toBe(true);
        expect(isEmptyRange(undefined)).toBe(true);
    });
});

// "This Month" on September 2025 is a lie the header immediately contradicts, so the chip label
// depends on whether the period on screen is the one the user is living in.
describe('rangeLabelKeyOf', () => {
    it('names the period absolutely while it is the current one', () => {
        expect(rangeLabelKeyOf(EARNINGS_RANGES.today, true)).toBe('today');
        expect(rangeLabelKeyOf(EARNINGS_RANGES.week, true)).toBe('thisWeek');
        expect(rangeLabelKeyOf(EARNINGS_RANGES.month, true)).toBe('thisMonth');
    });

    it('drops to a neutral name once the picker has moved to a past period', () => {
        expect(rangeLabelKeyOf(EARNINGS_RANGES.today, false)).toBe('day');
        expect(rangeLabelKeyOf(EARNINGS_RANGES.week, false)).toBe('week');
        expect(rangeLabelKeyOf(EARNINGS_RANGES.month, false)).toBe('month');
    });
});
