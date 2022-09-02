import React from 'react';

import IndustriesTaps from './IndustriesTabs';

import mockData from './mockData';

export default {
    title: 'packages/Industrie',
};

export const Industries = ({ onPress }) => (
    <IndustriesTaps
        title="Industries"
        data={mockData.map((item) => ({ title: item.title }))}
        onPress={() => {}}
        selectedIndex={2}
    />
);
