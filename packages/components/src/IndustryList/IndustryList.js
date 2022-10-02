import React from 'react';

import { VENDOR_INDUSTRIES_MAPPING } from '@jmsstudiosinc/vendor';

import ChipList from '../ChipList/ChipList';

const IndustryList = ({ 
    data, 
    title,
    value,
    onPress
}) => <ChipList 
    title={title} 
    options={data.map((item) => VENDOR_INDUSTRIES_MAPPING[item].title)}
    currentIndex={data.indexOf(value)} 
    onPress={(index) => onPress(data[index])} />

export default IndustryList;
