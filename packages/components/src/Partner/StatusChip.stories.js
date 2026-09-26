import React from 'react';
import { View } from 'react-native';

import { MD3LightTheme } from '@jmstechnologiesinc/react-native-paper';

import StatusChip, { SlaChip } from './StatusChip';

export default {
    title: 'packages/Partner/StatusChip',
};

const row = {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: MD3LightTheme.spacing.x2,
    padding: MD3LightTheme.spacing.x4,
};

// The labels come from the `partner.*` catalogue, which belongs to
// `@jmstechnologiesinc/partner` and is registered by the host. Here they are
// passed explicitly, one per tone.
export const Tones = () => (
    <View style={row}>
        <StatusChip kind="partnership" value="active" label="Active" />
        <StatusChip kind="verification" value="pending" label="Pending" />
        <StatusChip kind="verification" value="unverified" label="Unverified" />
        <StatusChip kind="partnership" value="onboarding" label="Onboarding" />
        <StatusChip kind="task_status" value="closed" label="Closed" />
    </View>
);

export const Compact = () => (
    <View style={row}>
        <StatusChip compact kind="screening_result" value="clear" label="Clear" />
        <StatusChip compact kind="adjudication" value="post_adverse_action" label="Post-adverse action" />
    </View>
);

// Without a registered catalogue a value renders as itself, never as its key.
export const WithoutCatalogue = () => (
    <View style={row}>
        <StatusChip kind="requirement_bucket" value="past_due" />
        <StatusChip kind="requirement_bucket" value="eventually_due" />
    </View>
);

export const Sla = () => (
    <View style={row}>
        <SlaChip state="on_time" label="Due in 2 days" />
        <SlaChip state="due_soon" label="Due in 3 h" />
        <SlaChip state="overdue" label="Overdue by 1 h" />
    </View>
);
