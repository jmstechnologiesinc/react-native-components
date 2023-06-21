import React from 'react';

import { List } from '@/react-native-paper';

import mockData from './mockData.json';

import StickyList from './StickySectionList';

export default {
    title: 'packages/StickySectionList',
};

export const Basic = () => (
    <StickyList
        sections={mockData}
        renderSectionHeader={({ section: { title } }) => <List.Subheader>{title}</List.Subheader>}
        renderItem={({ item }) => <List.Item title={item.title} description={item.description} />}
    />
);
