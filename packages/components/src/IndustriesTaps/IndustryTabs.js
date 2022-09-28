import React from 'react';

import { VENDOR_INDUSTRIES_MAPPING } from '@jmsstudiosinc/vendor';

import { fontAwesomeIndustryIcon } from './FontAwesomeIndustryIcon';
import { Scrollable } from '../Tabs/Tabs';

const IndustryTabs = ({ data, title, onPress, selectedIndex  }) => (
    <Scrollable
        title={title}
        data={data.map((item, index) => ({
            title: VENDOR_INDUSTRIES_MAPPING[item].title,
            variant: 'iconTop',
            isSelected: selectedIndex === index,
            fontAwesomeIcon: () => fontAwesomeIndustryIcon(item, selectedIndex === index),
            onPress: () => onPress(item, index)
        }))}
        onTabsItemLayout={() => {}}
        
    />
);

export default IndustryTabs;
