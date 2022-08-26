import React from 'react';
import HLTabs from './HLTabs';

export default {
    title: 'packages/HLTabsWrapper',
};

const options = [
    { title: 'Delivery', value: 'delivery' },
    { title: 'Pickup', value: 'pickup' },
];
const tips = [
    { title: '0', value: '0' },
    { title: '5%', value: '5' },
    { title: '10%', value: '10' },
    { title: '15%', value: '15' },
    { title: '20%', value: '20' },
];
const onpress = () => console.log(options[1].value);
const onTips = () => console.log(tips[2].value);

export const HLTabsWrappers = () => (
    <HLTabs options={options} title={'Shopping mode'} value={'delivery'} onSelect={onpress} />
);

export const ChipWrapper = () => <HLTabs options={tips} title={'Tips'} value={'10'} onSelect={onTips} />;
