import React from 'react';

import SegmentedButtonGroup from './SegmentedButtonGroup';

import mockData from './mockData.json';

export default {
    title: 'packages/SegmentedButtonGroup',
};

export const OneButton = ({ onPress }) => (
    <SegmentedButtonGroup
        title="Available Shipping Mode"
        data={mockData.singleButtons}
        onPress={() => {}}
        value={'pickup'}
    />
);

export const TwoButtons = ({ onPress }) => (
    <SegmentedButtonGroup
        title="Available Shipping Mode"
        data={mockData.twoButtons}
        onPress={() => {}}
        value={'delivery'}
    />
);

export const subTitleButtons = ({ onPress }) => (
    <SegmentedButtonGroup
        title="Available Shipping Mode"
        data={mockData.subLabelButtons}
        onPress={() => {}}
        density="high"
        value={'delivery'}
    />
);
