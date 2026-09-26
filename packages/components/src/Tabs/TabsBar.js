import React from 'react';
import { StyleSheet } from 'react-native';

import TabsItem, { TABS_ITEM_VARIANTS } from './TabsItem';
import TabsScrollable from './TabsScrollable';

/**
 * MD3 primary tabs with a value/label API: `Tabs.Scrollable` of `Tabs.Item variant="primary"`. The bar is
 * the `tablist` (named `accessibilityLabel`; on the web Left/Right/Home/End with automatic activation and a
 * roving tabindex) and each item a `tab` with its selected state. Unlike a bare `Tabs.Scrollable`, which is
 * as wide as the window, the bar is as wide as its container and never taller than its tabs (a horizontal
 * ScrollView grows along a column on react-native-web).
 *
 * @param {{tabs: Array<{value: string, label: string, disabled?: boolean, accessibilityLabel?: string}>,
 *     value?: string, onChange: (value: string) => void, accessibilityLabel?: string, style?: any,
 *     testID?: string}} props testIDs `<testID>` (the tablist), `<testID>-<value>`; default `tabs`
 */
const TabsBar = ({ tabs, value, onChange, accessibilityLabel, style, testID = 'tabs' }) => {
    const currentIndex = tabs.findIndex((tab) => tab.value === value);
    return (
        <TabsScrollable
            currentIndex={currentIndex}
            style={[styles.bar, style]}
            accessibilityLabel={accessibilityLabel}
            testID={testID}
        >
            {tabs.map((tab) => (
                <TabsItem
                    key={tab.value}
                    variant={TABS_ITEM_VARIANTS.primary}
                    title={tab.label}
                    isSelected={tab.value === value}
                    onPress={() => onChange(tab.value)}
                    disabled={tab.disabled}
                    accessibilityLabel={tab.accessibilityLabel}
                    testID={`${testID}-${tab.value}`}
                />
            ))}
        </TabsScrollable>
    );
};

const styles = StyleSheet.create({
    bar: {
        width: '100%',
        flexGrow: 0,
    },
});

export default TabsBar;
