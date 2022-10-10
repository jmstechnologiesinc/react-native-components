import React from 'react';

import { Chip, MD3LightTheme } from '@jmsstudiosinc/react-native-paper';
import * as Tabs from '../Tabs/Tabs';

const ChipList = ({ 
    title, 
    options, 
    mode="outlined",
    currentIndex, 
    onPress,
    listSectionStyle
}) => (
    <Tabs.Scrollable 
        title={title} 
        currentIndex={currentIndex}
        listSectionStyle={listSectionStyle}
        tabsListStyle={{marginHorizontal: MD3LightTheme.margin}}>
        {options.map((item, index) => (
            <Chip
                mode={mode}
                selected={currentIndex === index}  
                showSelectedOverlay 
                onPress={() => onPress(index)}
                style={index !== 0 && { marginLeft: MD3LightTheme.margin / 2 }}>
                {item}
            </Chip>
        ))}
    </Tabs.Scrollable>
);

export default ChipList;
