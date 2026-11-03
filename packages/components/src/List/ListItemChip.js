import React from 'react';
import { StyleSheet } from 'react-native';

import { Chip, MD3LightTheme } from '@jmstechnologiesinc/react-native-paper';
import { ITEM_TYPE_ICON_MAPPING, ITEM_TYPE } from '@jmstechnologiesinc/commons';
import { makeLinkingCall } from '../utils';

const ListItemChip = (chip) => {
    switch (chip.type) {
        case ITEM_TYPE.call:
            return (
                <Chip
                    mode="outlined"
                    icon={ITEM_TYPE_ICON_MAPPING[chip.type]}
                    style={styles.chip}
                    onPress={() => makeLinkingCall(chip.value)}
                >
                    {chip.formattedValue}
                </Chip>
            );
            break;
        default:
            return (
                // It SHOWS a value and is not pressable, so it is announced as text, not as a button (Paper's default
                // role for a chip), as StatusChip does.
                <Chip
                    mode={chip.type === ITEM_TYPE.needAttention ? 'flat' : 'outlined'}
                    icon={ITEM_TYPE_ICON_MAPPING[chip.type]}
                    style={styles.chip}
                    accessibilityRole="text"
                >
                    {chip.formattedValue}
                </Chip>
            );
            break;
    }
};

const styles = StyleSheet.create({
    chip: {
        marginRight: MD3LightTheme.spacing.x2,
    },
});

export default ListItemChip;
