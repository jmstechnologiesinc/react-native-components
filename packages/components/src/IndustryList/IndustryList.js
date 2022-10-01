import React from 'react';

import { VENDOR_INDUSTRIES_MAPPING } from '@jmsstudiosinc/vendor';

import ChipList from '../ChipList/ChipList';

const IndustryList = ({ 
    data, 
    title,
    value,
    onPress
}) => <ChipList 
    options={data.map((item) => ({
        title: VENDOR_INDUSTRIES_MAPPING[item].title,
        value: item,
    }))}
    title={title} 
    value={value} 
    onSelect={onPress} />

export default IndustryList;
