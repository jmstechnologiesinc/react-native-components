import React, { useEffect, useRef } from 'react';

import { StyleSheet, View } from 'react-native';

import { accessibilityProps, isWeb } from '../accessibility';

const TABLIST = 'tablist';
const NAVIGATION_KEYS = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];

const tabsOf = (list) =>
    Array.from(list.querySelectorAll('[role="tab"]')).filter((tab) => tab.getAttribute('aria-disabled') !== 'true');

const nextIndex = (key, current, count, isRtl) => {
    if (key === 'Home') {
        return 0;
    }
    if (key === 'End') {
        return count - 1;
    }
    const forward = (key === 'ArrowRight') !== isRtl;
    return (current + (forward ? 1 : -1) + count) % count;
};

// WAI-ARIA tabs with automatic activation, on the web: Left/Right move to the previous/next tab (wrapping,
// mirrored in RTL), Home/End to the first/last, and the tab reached is selected by clicking it (which is
// what fires its `onPress` on react-native-web). The handler sits on the list, so the items need no
// knowledge of their siblings.
const onTabListKeyDown = (event) => {
    if (!NAVIGATION_KEYS.includes(event.key)) {
        return;
    }
    const list = event.currentTarget;
    const tabs = tabsOf(list);
    const current = tabs.findIndex((tab) => tab === event.target || tab.contains(event.target));
    if (current === -1) {
        return;
    }
    event.preventDefault();
    const next = nextIndex(event.key, current, tabs.length, !!list.closest?.('[dir="rtl"]'));
    if (next !== current) {
        tabs[next].focus();
        tabs[next].click();
    }
};

// Roving tabindex: only the selected tab is a Tab stop (`Tabs.Item` renders that), and when no tab is
// selected the first one is, so the list can always be reached from the keyboard.
const syncTabStops = (list) => {
    if (!list?.querySelectorAll) {
        return;
    }
    const tabs = tabsOf(list);
    const selected = tabs.findIndex((tab) => tab.getAttribute('aria-selected') === 'true');
    tabs.forEach((tab, index) => tab.setAttribute('tabindex', index === (selected === -1 ? 0 : selected) ? '0' : '-1'));
};

/**
 * The row of tabs: `accessibilityRole="tablist"` (and `accessibilityLabel`) by default, with keyboard
 * navigation on the web. A host that lays out something other than tabs in it (`ChipList`) passes
 * `accessibilityRole={null}`, which renders no role and no keyboard handling.
 */
const TabList = ({ children, style, accessibilityRole = TABLIST, accessibilityLabel, testID }) => {
    const listRef = useRef(null);
    const isTabList = accessibilityRole === TABLIST;
    const keyboard = isTabList && isWeb();

    useEffect(() => {
        if (keyboard) {
            syncTabStops(listRef.current);
        }
    });

    return (
        <View
            ref={listRef}
            style={[styles.container, style]}
            {...(accessibilityRole ? accessibilityProps({ role: accessibilityRole, label: accessibilityLabel }) : {})}
            {...(keyboard && { onKeyDown: onTabListKeyDown })}
            {...(testID !== undefined && { testID })}
        >
            <View style={styles.row}>{children}</View>
        </View>
    );
};

export default TabList;

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
    },
});
