import React from 'react';
import { StyleSheet } from 'react-native';

import { Chip, MD3LightTheme } from '@jmstechnologiesinc/react-native-paper';
import { ITEM_TYPE_ICON_MAPPING, ITEM_TYPE } from '@jmstechnologiesinc/commons';
import { makeLinkingCall } from '../utils';

const ListItemChip = (chip) => {
    console.log(JSON.stringify(chip, null, 2));
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
                <Chip
                    mode={chip.type === ITEM_TYPE.needAttention ? 'flat' : 'outlined'}
                    icon={ITEM_TYPE_ICON_MAPPING[chip.type]}
                    style={styles.chip}
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
