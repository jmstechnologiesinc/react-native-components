import React, { useState } from 'react';

import TipsFilter from './TipsFilter';

export default {
    title: 'packages/TipsFilter',
};

const tipsFilter = {
    description:
        '100% of your tips go to support your courier. Tips are calculated based on your order total of  $10.49 ',
    selectedTipsPercentIndex: 2,
    options: [
        {
            value: 0,
            formattedValue: '0',
        },
        {
            value: 3,
            formattedValue: '3%',
        },
        {
            value: 5,
            formattedValue: '5%',
        },
        {
            value: 10,
            formattedValue: '10%',
        },
        {
            value: 13,
            formattedValue: '13%',
        },
        {
            value: 16,
            formattedValue: '16%',
        },
        {
            value: 19,
            formattedValue: '19%',
        },
    ],
};

export const Default = () => {
    return (
        <TipsFilter
            options={tipsFilter.options}
            description={tipsFilter.description}
            selectedTipsPercentIndex={tipsFilter.selectedTipsPercentIndex}
            onTipsPercentPress={() => null}
        />
    );
};
