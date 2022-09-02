import React from 'react';

import { List } from '@jmsstudiosinc/react-native-paper';
import { VENDOR_INDUSTRIES_MAPPING } from '@jmsstudiosinc/vendor';

import * as Tabs from '../Tabs/Tabs';

import { fontAwesomeIndustryIcon } from './FontAwesomeIndustryIcon';

const IndustriesTabs = ({ data, title, onPress, selectedIndex }) => (
    <List.Section title={title}>
        <Tabs.List>
            {data.map((item, index) => (
                <Tabs.Item
                    index={index}
                    variant="iconTop"
                    title={VENDOR_INDUSTRIES_MAPPING[item.title].title}
                    isSelected={selectedIndex === index}
                    onPress={() => onPress(index)}
                    fontAwesomeIcon={() => fontAwesomeIndustryIcon(item.title, selectedIndex === index)}
                />
            ))}
        </Tabs.List>
    </List.Section>
);

export default IndustriesTabs;
