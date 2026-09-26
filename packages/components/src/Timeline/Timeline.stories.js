import React from 'react';
import { View } from 'react-native';

import { MD3LightTheme } from '@jmstechnologiesinc/react-native-paper';

import Timeline from './Timeline';

export default {
    title: 'packages/Timeline',
};

const padded = { padding: MD3LightTheme.spacing.x4 };

const HISTORY = [
    { id: '1', title: 'Application submitted', at: '2026-09-20T14:02:00Z' },
    {
        id: '2',
        title: 'Driver license rejected',
        description: 'The document has expired',
        at: '2026-09-21T09:15:00Z',
        tone: 'danger',
        icon: 'close',
    },
    { id: '3', title: 'Driver license verified', at: '2026-09-22T16:40:00Z', tone: 'success', icon: 'check' },
    { id: '4', title: 'Background check in progress', at: '2026-09-23T08:00:00Z', tone: 'warning' },
];

const STEPS = [
    { id: 'account', title: 'Account', description: 'Name, email and phone' },
    { id: 'vehicle', title: 'Vehicle', description: 'Make, model and plate' },
    { id: 'documents', title: 'Documents', description: 'License, insurance and registration' },
    { id: 'screening', title: 'Background check' },
];

export const History = () => (
    <View style={padded}>
        <Timeline items={HISTORY} />
    </View>
);

export const Steps = () => (
    <View style={padded}>
        <Timeline variant="steps" items={STEPS} activeIndex={2} />
    </View>
);

export const StepsAllDone = () => (
    <View style={padded}>
        <Timeline variant="steps" items={STEPS} activeIndex={STEPS.length} />
    </View>
);
