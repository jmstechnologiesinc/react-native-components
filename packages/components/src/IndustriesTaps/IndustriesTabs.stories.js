import React from 'react';

import IndustriesTaps from './IndustryTabs';

import mockData from './mockData';

export default {
    title: 'packages/IndustriesTap',
};

export const Industries = ({ onPress }) => (
    <IndustriesTaps title="Industries" data={mockData} onPress={() => {}} selectedIndex={2} />
);
