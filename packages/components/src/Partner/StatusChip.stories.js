import React from 'react';
import { View } from 'react-native';

import {
    CHECKR_REPORT_ADJUDICATION,
    CHECKR_REPORT_RESULT,
    EN,
    ES,
    LABEL_GROUPS,
    PARTNERSHIP_STATUS,
    REQUIREMENT_BUCKET,
    REVIEW_TASK_STATUS,
    VERIFICATION_STATUS,
} from '@jmstechnologiesinc/partner';
import { MD3LightTheme, Text } from '@jmstechnologiesinc/react-native-paper';

import { registerFlatCatalog } from '../Localization/Localization';
import StatusChip, { SlaChip } from './StatusChip';
import { STATUS_KIND_GROUP } from './viewModel';

// The labels come from the `partner.*` catalogue, which belongs to
// `@jmstechnologiesinc/partner` (R2). A host registers it once, as here.
registerFlatCatalog({ en: EN, es: ES });

export default {
    title: 'packages/Partner/StatusChip',
};

const row = {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: MD3LightTheme.spacing.x2,
    padding: MD3LightTheme.spacing.x4,
};

export const Tones = () => (
    <View style={row}>
        <StatusChip kind="partnership" value={PARTNERSHIP_STATUS.ACTIVE} />
        <StatusChip kind="verification" value={VERIFICATION_STATUS.PENDING} />
        <StatusChip kind="verification" value={VERIFICATION_STATUS.UNVERIFIED} />
        <StatusChip kind="partnership" value={PARTNERSHIP_STATUS.ONBOARDING} />
        <StatusChip kind="task_status" value={REVIEW_TASK_STATUS.CLOSED} />
    </View>
);

export const Compact = () => (
    <View style={row}>
        <StatusChip compact kind="screening_result" value={CHECKR_REPORT_RESULT.CLEAR} />
        <StatusChip compact kind="adjudication" value={CHECKR_REPORT_ADJUDICATION.POST_ADVERSE_ACTION} />
    </View>
);

// Every value of every kind, walked from the package: what the completeness
// test checks, on screen.
export const EveryKind = () => (
    <View>
        {Object.entries(STATUS_KIND_GROUP).map(([kind, group]) => (
            <View key={kind}>
                <Text variant="labelLarge" style={{ paddingHorizontal: MD3LightTheme.spacing.x4 }}>
                    {kind}
                </Text>
                <View style={row}>
                    {Object.values(LABEL_GROUPS[group]).map((value) => (
                        <StatusChip key={value} compact kind={kind} value={value} />
                    ))}
                </View>
            </View>
        ))}
    </View>
);

// A value the package does not declare (a newer server) renders as itself,
// never as its key, and neutral.
export const UnknownValue = () => (
    <View style={row}>
        <StatusChip kind="partnership" value="waitlisted" />
        <StatusChip kind="requirement_bucket" value={REQUIREMENT_BUCKET.PAST_DUE} />
    </View>
);

export const Sla = () => (
    <View style={row}>
        <SlaChip state="on_time" label="Due in 2 days" />
        <SlaChip state="due_soon" label="Due in 3 h" />
        <SlaChip state="overdue" label="Overdue by 1 h" />
    </View>
);
