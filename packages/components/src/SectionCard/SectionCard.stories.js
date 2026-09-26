import React from 'react';

import { Chip, Provider } from '@jmstechnologiesinc/react-native-paper';

import SectionCard from './SectionCard';
import KeyValueList from '../KeyValueList/KeyValueList';

export default {
    title: 'packages/SectionCard',
};

export const WithContent = () => (
    <Provider>
        <SectionCard title="Task" subtitle="Documents queue" trailing={<Chip compact>Open</Chip>}>
            <KeyValueList
                items={[
                    { key: 'queue', label: 'Queue', value: 'Documents' },
                    { key: 'assignee', label: 'Assignee', value: null },
                ]}
            />
        </SectionCard>
    </Provider>
);

export const TitleOnly = () => (
    <Provider>
        <SectionCard title="No details" />
    </Provider>
);
