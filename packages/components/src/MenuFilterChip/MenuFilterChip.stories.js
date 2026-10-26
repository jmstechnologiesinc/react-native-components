import React, { useState } from 'react';
import { View } from 'react-native';

import { Button, MD3LightTheme, Provider } from '@jmstechnologiesinc/react-native-paper';

import ChipRow from '../ChipRow/ChipRow';
import MenuFilterChip from './MenuFilterChip';

export default {
    title: 'packages/MenuFilterChip',
};

const TYPES = [
    { value: 'driver', label: 'Driver' },
    { value: 'vendor', label: 'Business' },
];
const STATUSES = [
    { value: 'onboarding', label: 'Onboarding' },
    { value: 'active', label: 'Active' },
    { value: 'deactivated', label: 'Deactivated' },
    { value: 'rejected', label: 'Not approved' },
];
const JURISDICTIONS = [
    { value: 'US', label: 'US' },
    { value: 'US-MA', label: 'US › US-MA' },
    { value: 'DO', label: 'DO' },
];

// The directory's filter set: one chip per dimension, every one single-choice, and one way to clear them.
export const FilterSet = () => {
    const [type, setType] = useState(null);
    const [status, setStatus] = useState('active');
    const [jurisdiction, setJurisdiction] = useState(null);
    const filtered = Boolean(type || status || jurisdiction);
    return (
        <Provider>
            <View style={{ padding: MD3LightTheme.spacing.x4, minHeight: 320 }}>
                <ChipRow>
                    <MenuFilterChip
                        label="Type"
                        options={TYPES}
                        value={type}
                        onChange={setType}
                        clearLabel="Any type"
                    />
                    <MenuFilterChip
                        label="Status"
                        options={STATUSES}
                        value={status}
                        onChange={setStatus}
                        clearLabel="Any status"
                    />
                    <MenuFilterChip
                        label="Jurisdiction"
                        options={JURISDICTIONS}
                        value={jurisdiction}
                        onChange={setJurisdiction}
                        clearLabel="Any jurisdiction"
                    />
                    {filtered ? (
                        <Button
                            mode="text"
                            onPress={() => {
                                setType(null);
                                setStatus(null);
                                setJurisdiction(null);
                            }}
                        >
                            Clear filters
                        </Button>
                    ) : null}
                </ChipRow>
            </View>
        </Provider>
    );
};

export const Disabled = () => (
    <Provider>
        <View style={{ padding: MD3LightTheme.spacing.x4 }}>
            <MenuFilterChip label="Status" options={STATUSES} value={null} onChange={() => {}} disabled />
        </View>
    </Provider>
);
