import React from 'react';

import { View } from 'react-native';

import { MD3LightTheme, Text, TouchableRipple } from '@jmstechnologiesinc/react-native-paper';
import { moderateScale } from '@jmstechnologiesinc/react-native-size-matters';

import { accessibilityProps, isWeb } from '../accessibility';

export const TABS_ITEM_VARIANTS = Object.freeze({ primary: 'primary' });

const labelColor = (isSelected) => (isSelected ? MD3LightTheme.colors.primary : MD3LightTheme.colors.onSurfaceVariant);

/**
 * A tab (`accessibilityRole="tab"`, selected state; `aria-selected` on the web). On the web only the
 * selected tab is in the Tab order (`tabIndex` 0, the rest -1): `Tabs.List` moves between them with the
 * arrow keys.
 *
 * `variant`: omitted keeps the library's original look (a 2dp full-width underline); `'primary'` is the MD3
 * primary tab — 48dp tall, a 3dp indicator with rounded top corners under the label's width, and no layout
 * shift when the selection moves.
 */
const TabsItem = ({ title, isSelected, onPress, style, variant, disabled, accessibilityLabel, testID }) => {
    const semantics = {
        ...accessibilityProps({
            role: 'tab',
            label: accessibilityLabel,
            selected: !!isSelected,
            ...(disabled !== undefined && { disabled: !!disabled }),
        }),
        ...(isWeb() && { tabIndex: isSelected ? 0 : -1 }),
        ...(disabled !== undefined && { disabled }),
        ...(testID !== undefined && { testID }),
    };

    if (variant === TABS_ITEM_VARIANTS.primary) {
        return (
            <TouchableRipple onPress={onPress} style={[styles.primaryTab, style]} {...semantics}>
                <View style={styles.primaryContent}>
                    <Text style={{ color: labelColor(isSelected) }} variant="titleSmall">
                        {title}
                    </Text>
                    {isSelected ? <View style={styles.primaryIndicator} /> : null}
                </View>
            </TouchableRipple>
        );
    }

    return (
        <TouchableRipple
            onPress={onPress}
            style={[
                {
                    paddingHorizontal: MD3LightTheme.spacing.x4,
                    paddingVertical: MD3LightTheme.spacing.x4,
                    ...(isSelected && {
                        borderColor: MD3LightTheme.colors.primary,
                        borderBottomWidth: moderateScale(2),
                    }),
                },
                style,
            ]}
            {...semantics}
        >
            <Text style={{ color: labelColor(isSelected) }} variant="labelLarge">
                {title}
            </Text>
        </TouchableRipple>
    );
};

const INDICATOR_THICKNESS = moderateScale(3);

const styles = {
    primaryTab: {
        paddingHorizontal: MD3LightTheme.spacing.x4,
    },
    // The indicator is positioned against this box, which is exactly the label's width and the tab's height.
    primaryContent: {
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: MD3LightTheme.spacing.x12,
    },
    // MD3 primary tab indicator: as wide as the label (at least 24dp), 3dp thick, top corners rounded.
    primaryIndicator: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        minWidth: MD3LightTheme.spacing.x6,
        height: INDICATOR_THICKNESS,
        borderTopLeftRadius: INDICATOR_THICKNESS,
        borderTopRightRadius: INDICATOR_THICKNESS,
        backgroundColor: MD3LightTheme.colors.primary,
    },
};

export default TabsItem;
