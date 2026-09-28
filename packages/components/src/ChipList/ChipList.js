import React from 'react';

import { Chip, useTheme } from '@jmstechnologiesinc/react-native-paper';
import * as Tabs from '../Tabs/Tabs';

const ChipList = ({
    options = [],
    compact,
    mode = 'outlined',
    currentIndex,
    onPress,
    onClose,
    isDisabled,
    chipStyle,
    listSectionStyle,
    style,
}) => {
    // MD3 keeps 8dp between the chips of a row, from the theme in use (a host may scale its tokens).
    const { spacing } = useTheme();
    // Chips are not tabs: no `tablist` role and no tab keyboard navigation on the row.
    return (
        <Tabs.Scrollable
            currentIndex={currentIndex}
            listSectionStyle={listSectionStyle}
            style={style}
            accessibilityRole={null}
        >
            {options.map((item, index) => (
                <Chip
                    key={item?.toString()}
                    mode={mode}
                    selected={currentIndex === index}
                    showSelectedOverlay
                    compact={compact}
                    onPress={onPress ? () => onPress(index) : null}
                    onClose={onClose ? () => onClose(index) : null}
                    style={[index !== 0 && { marginLeft: spacing.x2 }, chipStyle]}
                    disabled={isDisabled}
                >
                    {item}
                </Chip>
            ))}
        </Tabs.Scrollable>
    );
};

export default ChipList;
