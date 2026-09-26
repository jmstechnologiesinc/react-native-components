import React from 'react';

import { Chip } from '@jmstechnologiesinc/react-native-paper';

import KeyValueList from './KeyValueList';

export default {
    title: 'packages/KeyValueList',
};

export const Rows = () => (
    <KeyValueList
        items={[
            { key: 'id', label: 'Request id', value: 'req_01J9Z' },
            { key: 'count', label: 'Attempts', value: 0 },
            { key: 'assignee', label: 'Assignee', value: null },
            { key: 'status', label: 'Status', value: <Chip compact>Open</Chip> },
        ]}
    />
);
