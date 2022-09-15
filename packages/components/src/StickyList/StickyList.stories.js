import React from 'react';

import { List } from '@jmsstudiosinc/react-native-paper';

import { SectionHeader } from '../List';
import StickyList from '.';

import mockData from '../ProductList/mockData.json';

export default {
    title: 'packages/StickyList',
};

export const SectionList = () => (
    <StickyList
        sections={mockData}
        renderSectionHeader={({ section: { title } }) => <SectionHeader title={title} />}
        renderItem={({ item }) => <List.Item title={item.title} description={item.description} />}
    />
);
