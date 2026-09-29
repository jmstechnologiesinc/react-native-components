import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Text, useTheme } from '@jmstechnologiesinc/react-native-paper';

import { EMPTY_VALUE } from '../valueText';

const isBlank = (value) => value === undefined || value === null || value === '';

/**
 * Label/value rows (a summary, an envelope): the label in `labelLarge` `onSurfaceVariant` on the leading
 * 40%, the value in `bodyMedium`, selectable. A value is shown as given — a string, a number or a node (a
 * chip, a link) — and an absent one as an em dash. A `list` of `listitem`s. The label sits on the value's
 * first baseline, so it reads on the same line as a chip's label or a value's first line of text.
 *
 * @param {{items: Array<{key: string, label: string, value?: React.ReactNode}>, testID?: string}} props
 *     each row's testID is `<testID>-<key>` when `testID` is given
 */
const KeyValueList = ({ items, testID }) => {
    const { colors, spacing } = useTheme();
    return (
        <View role="list" testID={testID}>
            {items.map(({ key, label, value }) => (
                <View
                    key={key}
                    role="listitem"
                    style={[styles.row, { paddingVertical: spacing.x2 }]}
                    testID={testID ? `${testID}-${key}` : undefined}
                >
                    <Text
                        variant="labelLarge"
                        style={[styles.label, { color: colors.onSurfaceVariant, marginRight: spacing.x4 }]}
                    >
                        {label}
                    </Text>
                    <View style={styles.value}>
                        {React.isValidElement(value) ? (
                            value
                        ) : (
                            <Text variant="bodyMedium" selectable>
                                {isBlank(value) ? EMPTY_VALUE : String(value)}
                            </Text>
                        )}
                    </View>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    label: {
        width: '40%',
    },
    value: {
        flex: 1,
        minWidth: 0,
    },
});

export default KeyValueList;
