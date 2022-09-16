import React from 'react';

import { List } from '@jmsstudiosinc/react-native-paper';

import mockData from './mockData.json';

import StickyList from '.';

export default {
    title: 'packages/StickyList',
};

export const SectionList = () => (
    <StickyList
        sections={mockData}
        renderSectionHeader={({ section: { title } }) => <List.Subheader>{title}</List.Subheader>}
        renderItem={({ item }) => <List.Item title={item.title} description={item.description} />}
    />
);
