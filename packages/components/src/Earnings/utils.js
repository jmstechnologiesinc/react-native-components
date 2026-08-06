// Pure presentation logic of the earnings chart. No react-native imports, so it runs in node.
//
// The shape is the one the backend aggregates and returns (functions/driverApp/getEarnings.js):
//   { buckets: [{ key, label, value, formattedValue }], total, feeList, payouts }
//
// `value` is in cents, like every amount that crosses the wire (dinero.js, never floats), and it
// exists only to size a bar. What the user reads is always `formattedValue`, already formatted and
// localized by the backend.
//
// This module deliberately has no sum. The total is authoritative from the backend: a client-side
// total that disagrees with the payout is a support ticket nobody can close.

export const EARNINGS_RANGES = {
    today: 'today',
    week: 'week',
    month: 'month',
};

// Translation keys per range, so the consuming app builds its SegmentedButtonGroup from here
// instead of hardcoding labels in each of the two apps that show earnings.
//
// Two per range on purpose: "This Month" is only true while the current month is on screen. Browse
// back to September 2025 and the chip has to read "Month", or the header and the chip contradict
// each other.
export const EARNINGS_RANGES_MAPPING = {
    [EARNINGS_RANGES.today]: { current: 'today', past: 'day' },
    [EARNINGS_RANGES.week]: { current: 'thisWeek', past: 'week' },
    [EARNINGS_RANGES.month]: { current: 'thisMonth', past: 'month' },
};

/** The translation key a range chip should show for the period currently on screen. */
export const rangeLabelKeyOf = (range, isCurrentPeriod) =>
    EARNINGS_RANGES_MAPPING[range][isCurrentPeriod ? 'current' : 'past'];

// A bucket with nothing earned still gets a visible stub, so an empty Tuesday reads as "worked
// nothing" instead of "no data for Tuesday".
export const MIN_BAR_RATIO = 0.02;

const valueOf = (bucket) => (Number.isFinite(bucket?.value) ? bucket.value : 0);

// Never negative: it is the denominator of every bar height.
export const peakValue = (buckets) => (buckets || []).reduce((peak, bucket) => Math.max(peak, valueOf(bucket)), 0);

// Height relative to the tallest bucket, in 0..1. Guards the two cases that would produce a NaN
// height: an empty range, and a range where everything is zero — a driver who did not work that
// week, which is a normal state and not an error.
export const barRatio = (bucket, peak) => {
    if (!(peak > 0)) {
        return MIN_BAR_RATIO;
    }

    // A negative bucket (an adjustment, a clawback) would need an axis to be drawn honestly. Until
    // there is one it sits on the floor rather than pointing the wrong way.
    return Math.max(valueOf(bucket) / peak, MIN_BAR_RATIO);
};

export const toBars = (buckets) => {
    const peak = peakValue(buckets);

    return (buckets || []).map((bucket) => ({
        ...bucket,
        ratio: barRatio(bucket, peak),
        isPeak: peak > 0 && valueOf(bucket) === peak,
    }));
};

// True when the range earned nothing at all. The buckets still exist — one per day — they are just
// all at zero, which is what the empty state has to say.
export const isEmptyRange = (buckets) => peakValue(buckets) <= 0;
