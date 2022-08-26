import React from 'react';
import ChipList from './chipList';

export default {
    title: 'packages/ChipList',
};

const tips = [
    { title: '0', value: '0' },
    { title: '5%', value: '5' },
    { title: '10%', value: '10' },
    { title: '15%', value: '15' },
    { title: '20%', value: '20' },
];

const onTips = () => console.log(tips[2].value);

export const ChipLists = () => <ChipList options={tips} title={'Tips'} value={'10'} onSelect={onTips} />;
