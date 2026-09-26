import React from 'react';
import { StyleSheet, View } from 'react-native';

import { IconButton, Text, useTheme } from '@jmstechnologiesinc/react-native-paper';

import { localized } from '../Localization/Localization';

/**
 * The title row of an MD3 side or bottom sheet: a headline and, with `onClose`, the close button.
 *
 * @param {{title?: string, onClose?: () => void, closeLabel?: string, testID?: string}} props `closeLabel`
 *     defaults to `global.close`
 */
const SheetHeader = ({ title, onClose, closeLabel, testID }) => {
    const { spacing } = useTheme();
    return (
        <View
            style={[styles.row, { paddingLeft: spacing.x6, paddingRight: spacing.x2, paddingVertical: spacing.x2 }]}
            testID={testID}
        >
            <Text variant="titleLarge" role="heading" style={styles.title} numberOfLines={1}>
                {title}
            </Text>
            {onClose ? (
                <IconButton
                    icon="close"
                    accessibilityLabel={closeLabel ?? localized('global.close')}
                    onPress={onClose}
                    testID={testID ? `${testID}-close` : undefined}
                />
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        flex: 1,
    },
});

export default SheetHeader;
