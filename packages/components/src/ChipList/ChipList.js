import React from 'react';

import { Chip, MD3LightTheme } from '@jmstechnologiesinc/react-native-paper';
import * as Tabs from '../Tabs/Tabs';

const ChipList = ({ options=[], compact, mode = 'outlined', currentIndex, onPress,onClose,isDisabled, listSectionStyle }) => (
    <Tabs.Scrollable currentIndex={currentIndex} listSectionStyle={listSectionStyle}>
        {options.map((item, index) => (
            <Chip
                key={item?.toString()}
                mode={mode}
                selected={currentIndex === index}
                showSelectedOverlay
                compact={compact}
                onPress={onPress? () => onPress(index) : null}
                onClose={onClose ? () => onClose(index) : null}
                style={index !== 0 && { marginLeft: MD3LightTheme.spacing.x4 / 2 }}
                disabled={isDisabled}
            >
                {item}
            </Chip>
        ))}
    </Tabs.Scrollable>
);

export default ChipList;
