import React from 'react';

import { VENDOR_INDUSTRIES_MAPPING } from '@jmstechnologiesinc/vendor';

import ChipList from '../ChipList/ChipList';
import { localized } from '../Localization/Localization';

const IndustryList = ({ data, value, onPress }) => (
    <ChipList
        options={data.map((item) => localized(VENDOR_INDUSTRIES_MAPPING[item].title))}
        currentIndex={data.indexOf(value)}
        onPress={(index) => onPress(data[index])}
    />
);

export default IndustryList;