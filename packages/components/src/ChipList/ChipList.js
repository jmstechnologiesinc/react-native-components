import React from 'react';

import { Chip, MD3LightTheme } from '@jmstechnologiesinc/react-native-paper';
import * as Tabs from '../Tabs/Tabs';

const ChipList = ({ options, compact, mode = 'outlined', currentIndex, onPress, listSectionStyle }) => (
    <Tabs.Scrollable currentIndex={currentIndex} listSectionStyle={listSectionStyle}>
        {options.map((item, index) => (
            <Chip
                key={item.toString()}
                mode={mode}
                selected={currentIndex === index}
                showSelectedOverlay
                compact={compact}
                onPress={() => onPress(index)}
                style={index !== 0 && { marginLeft: MD3LightTheme.spacing.x4 / 2 }}
            >
                {item}
            </Chip>
        ))}
    </Tabs.Scrollable>
);

export default ChipList;
