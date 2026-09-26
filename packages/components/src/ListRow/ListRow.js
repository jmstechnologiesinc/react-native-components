import React from 'react';
import { StyleSheet, View } from 'react-native';

import { List, Text, useTheme } from '@jmstechnologiesinc/react-native-paper';

import { iconSlot, nodeSlot } from './listSlots';

/**
 * One row of a list: always a Paper `List.Item`, inside a `listitem` (use it inside a `View role="list"`
 * with an accessible name).
 *
 * - `onPress` makes it a `button` named `accessibilityLabel ?? title`. Without it the row is Paper's
 *   non-pressable item (on the web the fork renders its disabled press wrapper `aria-disabled`: see
 *   PROJECT.md, Paper fork web a11y items).
 * - `selected` paints `secondaryContainer` and announces `aria-current`.
 * - `details` render under the description, inside the row (chips, say); `children` under the row,
 *   inside the same list item.
 * - `inset` (default true) adds the pane's horizontal padding; false aligns the row with a card's content.
 *   `rounded` draws the MD3 list-destination shape (inset by 12dp, fully rounded).
 *
 * @param {{title: string, description?: string, details?: React.ReactNode, icon?: string, iconColor?: string,
 *     trailing?: React.ReactNode, onPress?: () => void, selected?: boolean, accessibilityLabel?: string,
 *     inset?: boolean, rounded?: boolean, titleNumberOfLines?: number, descriptionNumberOfLines?: number,
 *     testID?: string, children?: React.ReactNode}} props
 */
const ListRow = ({
    title,
    description,
    details,
    icon,
    iconColor,
    trailing,
    onPress,
    selected = false,
    accessibilityLabel,
    inset = true,
    rounded = false,
    titleNumberOfLines,
    descriptionNumberOfLines,
    testID,
    children,
}) => {
    const { colors, roundness, spacing } = useTheme();
    const pressable = Boolean(onPress);
    const detailed = details ? (
        <View>
            {description ? (
                <Text
                    variant="bodyMedium"
                    numberOfLines={descriptionNumberOfLines}
                    style={{ color: colors.onSurfaceVariant }}
                >
                    {description}
                </Text>
            ) : null}
            {details}
        </View>
    ) : null;

    return (
        <View role="listitem">
            <List.Item
                title={title}
                description={detailed ? nodeSlot(detailed) : description}
                titleNumberOfLines={titleNumberOfLines}
                descriptionNumberOfLines={descriptionNumberOfLines}
                onPress={onPress}
                role={pressable ? 'button' : undefined}
                aria-current={selected ? 'true' : undefined}
                aria-label={pressable || accessibilityLabel ? accessibilityLabel ?? title : undefined}
                testID={testID}
                style={[
                    inset ? { paddingLeft: spacing.x2, paddingRight: spacing.x4 } : styles.flush,
                    rounded && { marginHorizontal: spacing.x3, borderRadius: roundness * 4 },
                    selected && { backgroundColor: colors.secondaryContainer },
                ]}
                left={icon ? iconSlot(icon, iconColor) : undefined}
                right={trailing ? nodeSlot(<View style={styles.trailing}>{trailing}</View>) : undefined}
            />
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    flush: {
        paddingHorizontal: 0,
    },
    trailing: {
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default ListRow;
