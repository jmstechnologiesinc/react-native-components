import React, { useState } from 'react';
import { View } from 'react-native';

import { Chip } from '@jmstechnologiesinc/react-native-paper';

import ListRow from './ListRow';

export default {
    title: 'packages/ListRow',
};

const ROWS = [
    { key: 'a', title: 'Driver license', description: 'Uploaded today', icon: 'card-account-details-outline' },
    { key: 'b', title: 'Vehicle insurance', description: 'Expires in 12 days', icon: 'shield-car' },
    { key: 'c', title: 'Background check', description: 'Pending', icon: 'account-search-outline' },
];

export const Selectable = () => {
    const [selected, setSelected] = useState('a');
    return (
        <View role="list" aria-label="Documents">
            {ROWS.map((row) => (
                <ListRow
                    key={row.key}
                    title={row.title}
                    description={row.description}
                    icon={row.icon}
                    selected={selected === row.key}
                    onPress={() => setSelected(row.key)}
                    rounded
                />
            ))}
        </View>
    );
};

export const ReadOnlyWithDetails = () => (
    <View role="list" aria-label="Checks">
        <ListRow
            title="Motor vehicle report"
            description="Completed"
            details={<Chip compact>Clear</Chip>}
            trailing={<Chip compact>2 days</Chip>}
            icon="car"
        />
    </View>
);
