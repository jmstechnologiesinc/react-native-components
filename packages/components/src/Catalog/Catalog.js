import React from 'react';
import { Scrollable } from '../Tabs/Tabs';

const Catalog = ({ data, catalogFilter, onPress, selectedIndex, title = 'Menu' }) => {
    if (!data?.length) {
        return null;
    }
    return (
        <Scrollable
            title={title}
            data={data.map((item, index) => ({
                title: item.title,
                isSelected: selectedIndex === index,
                onPress: () => onPress(item, index),
            }))}
            onTabsItemLayout={() => {}}
        />
    );
};

export default Catalog;
