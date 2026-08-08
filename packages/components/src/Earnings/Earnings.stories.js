import React, { useState } from 'react';

import Accounting from '../Accounting/Accounting';
import ScreenWrapper from '../ScreenWrapper';
import SegmentedButtonGroup from '../SegmentedButtonGroup/SegmentedButtonGroup';
import { localized } from '../Localization/Localization';

import Earnings, { EARNINGS_RANGES, rangeLabelKeyOf } from './index';

export default {
    title: 'packages/Earnings',
};

// This mock is the contract: it is exactly what `driverApp-getEarnings` has to return. Amounts are
// cents, and every string the user reads is already formatted and localized by the backend.
const WEEK = {
    period: { key: '2026-08-03', label: 'Aug 3 – 9' },
    periods: [
        { key: '2026-08-03', label: 'Aug 3 – 9' },
        { key: '2026-07-27', label: 'Jul 27 – Aug 2' },
        { key: '2026-07-20', label: 'Jul 20 – 26' },
        { key: '2026-07-13', label: 'Jul 13 – 19' },
    ],
    total: { formattedValue: '$423.50' },
    buckets: [
        { key: '2026-08-03', label: 'Mon', value: 6230, formattedValue: '$62.30' },
        { key: '2026-08-04', label: 'Tue', value: 0, formattedValue: '$0.00' },
        { key: '2026-08-05', label: 'Wed', value: 8140, formattedValue: '$81.40' },
        { key: '2026-08-06', label: 'Thu', value: 12460, formattedValue: '$124.60' },
        { key: '2026-08-07', label: 'Fri', value: 4700, formattedValue: '$47.00' },
        { key: '2026-08-08', label: 'Sat', value: 9820, formattedValue: '$98.20' },
        { key: '2026-08-09', label: 'Sun', value: 0, formattedValue: '$0.00' },
    ],
    feeList: [
        { id: 'baseFare', label: 'baseFare', formattedValue: '$248.00' },
        { id: 'distanceRatePerMile', label: 'distanceRatePerMile', formattedValue: '$96.50' },
        { id: 'tips', label: 'tips', formattedValue: '$79.00' },
        { id: 'total', label: 'total', formattedValue: '$423.50' },
    ],
    payouts: [
        { id: 'po_1', label: 'Aug 4, 2026', description: 'Paid', formattedValue: '$389.20' },
        { id: 'po_2', label: 'Jul 28, 2026', description: 'Paid', formattedValue: '$412.75' },
    ],
};

// A driver who did not work: the bars have to stay visible and muted, not vanish. It is the state
// a new driver sees first, so it cannot look like a loading failure.
const EMPTY_WEEK = {
    period: WEEK.period,
    periods: WEEK.periods,
    total: { formattedValue: '$0.00' },
    buckets: WEEK.buckets.map((bucket) => ({ ...bucket, value: 0, formattedValue: '$0.00' })),
    feeList: [],
    payouts: [],
};

const rangesFor = (isCurrentPeriod) => Object.values(EARNINGS_RANGES).map((range) => ({
    value: range,
    label: localized(rangeLabelKeyOf(range, isCurrentPeriod)),
}));

// Mirrors how CustomerApp composes the screen: Container gives the horizontal inset, Section the
// vertical rhythm, and the list-based blocks stay outside because their items bring their own.
const Screen = ({ data }) => {
    const [range, setRange] = useState(EARNINGS_RANGES.week);
    const [selectedKey, setSelectedKey] = useState();
    const [periodKey, setPeriodKey] = useState(data.period?.key);

    return (
        <ScreenWrapper>
            <ScreenWrapper.Container>
                <ScreenWrapper.Section>
                    <Earnings.PeriodPicker
                        periods={data.periods}
                        selectedKey={periodKey}
                        onSelect={(period) => setPeriodKey(period.key)}
                    />
                </ScreenWrapper.Section>

                <ScreenWrapper.Section>
                    <SegmentedButtonGroup
                        data={rangesFor(periodKey === data.periods?.[0]?.key)}
                        value={range}
                        onPress={setRange}
                    />
                </ScreenWrapper.Section>

                <ScreenWrapper.Section>
                    <Earnings.Summary total={data.total} />
                </ScreenWrapper.Section>

                <ScreenWrapper.Section>
                    <Earnings.BarChart
                        buckets={data.buckets}
                        selectedKey={selectedKey}
                        onPress={(bar) => setSelectedKey(bar.key)}
                    />
                </ScreenWrapper.Section>
            </ScreenWrapper.Container>

            <ScreenWrapper.Section>
                <Accounting feeList={data.feeList} />
            </ScreenWrapper.Section>

            <Earnings.PayoutList payouts={data.payouts} />
        </ScreenWrapper>
    );
};

export const Default = () => <Screen data={WEEK} />;

export const EmptyWeek = () => <Screen data={EMPTY_WEEK} />;

// Tapping a bar is how the driver drills into a day, so the selected state has to survive on its
// own without the peak highlight fighting it.
export const WithSelectedDay = () => (
    <Earnings.BarChart buckets={WEEK.buckets} selectedKey="2026-08-05" onPress={() => {}} />
);

// The chart is read-only in some surfaces (a dashboard tile): no onPress, no ripple, no button role.
export const ReadOnlyChart = () => <Earnings.BarChart buckets={WEEK.buckets} />;

// The "today" range returns a single bucket. It renders nothing: one bar is always the peak, so it
// would fill the plot as a solid block with nothing to compare against.
export const SingleBucketRendersNothing = () => (
    <Earnings.BarChart buckets={[WEEK.buckets[3]]} onPress={() => {}} />
);
