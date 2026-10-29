import React from 'react';
import { StyleSheet, View } from 'react-native';

import { List, Text, useTheme } from '@jmstechnologiesinc/react-native-paper';

import { localized } from '../Localization/Localization';

/**
 * One option of a choice that is shown, not asked (a read-only form in the partner console): its title and
 * description, and when `checked` a trailing check, announced «<title>, <description>, selected» (the catalogue's
 * `selected`). Put the rows inside a `View role="list"`.
 *
 * It is content, not a control, so it is not a Paper `List.Item`: Paper wraps every item in a `TouchableRipple`
 * that is disabled without `onPress`, and the host then carries `accessibilityState.disabled` (native) and
 * `aria-disabled` (web) — a choice announced «dimmed». This row is a `listitem` read as one element (the way
 * `StateFlow` reads its states), laid out as an MD3 list item from the theme's tokens.
 *
 * @param {{title: string, description?: string, checked?: boolean, titleNumberOfLines?: number,
 *     descriptionNumberOfLines?: number, testID?: string}} props
 */
const CheckedRow = ({
    title,
    description,
    checked = false,
    // A Paper list item's defaults, the row this one replaces.
    titleNumberOfLines = 1,
    descriptionNumberOfLines = 2,
    testID,
}) => {
    const { colors, spacing } = useTheme();
    return (
        <View
            role="listitem"
            accessible
            accessibilityLabel={[title, description, checked ? localized('selected') : null].filter(Boolean).join(', ')}
            testID={testID}
            style={[
                styles.row,
                {
                    minHeight: spacing.x14,
                    paddingVertical: spacing.x2,
                    paddingLeft: spacing.x4,
                    paddingRight: spacing.x6,
                    gap: spacing.x4,
                },
            ]}
        >
            <View style={styles.text}>
                <Text variant="bodyLarge" numberOfLines={titleNumberOfLines} style={{ color: colors.onSurface }}>
                    {title}
                </Text>
                {description ? (
                    <Text
                        variant="bodyMedium"
                        numberOfLines={descriptionNumberOfLines}
                        style={{ color: colors.onSurfaceVariant }}
                    >
                        {description}
                    </Text>
                ) : null}
            </View>
            {checked ? <List.Icon icon="check" color={colors.onSurfaceVariant} /> : null}
        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    text: {
        flex: 1,
    },
});

export default CheckedRow;
