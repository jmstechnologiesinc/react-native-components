import React, { useState } from 'react';


import ChipList from './ChipList';

export default {
    title: 'packages/ChipList',
};

const tips = ['0', '5%', '10%', '15%', '20%'];

export const Basic = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    return <ChipList options={tips} title={'Tips'} currentIndex={currentIndex} onPress={setCurrentIndex} />;
};
