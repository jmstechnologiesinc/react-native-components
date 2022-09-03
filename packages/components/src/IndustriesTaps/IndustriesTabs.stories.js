import React from 'react';

import IndustriesTaps from './IndustriesTabs';

import mockData from './mockData';

export default {
    title: 'packages/Industrie',
};

export const Industries = ({ onPress }) => (
    <IndustriesTaps title="Industries" data={mockData} onPress={() => {}} selectedIndex={2} />
);
