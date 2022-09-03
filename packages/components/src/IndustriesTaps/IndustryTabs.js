import React from 'react';

import { VENDOR_INDUSTRIES_MAPPING } from '@jmsstudiosinc/vendor';

import { fontAwesomeIndustryIcon } from './FontAwesomeIndustryIcon';
import TabsScrollable from '../Tabs/TabsScrollable';

const IndustryTabs = ({ data, title, onPress, selectedIndex }) => (
    <TabsScrollable
        title={title}
        data={data.map((item, index) => ({
            title: VENDOR_INDUSTRIES_MAPPING[item.title].title,
            variant: 'iconTop',
            isSelected: selectedIndex === index,
            fontAwesomeIcon: () => fontAwesomeIndustryIcon(item.title, selectedIndex === index),
        }))}
        onTabsItemLayout={() => {}}
        onPress={() => {}}
    />
);

export default IndustryTabs;
