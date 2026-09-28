import React, { useEffect, useRef } from 'react';

import { View } from 'react-native';

import { Divider, Drawer, MD3LightTheme } from '@jmstechnologiesinc/react-native-paper';

import { accessibilityProps, isWeb } from '../accessibility';

export const SIDE_NAV_VARIANTS = Object.freeze({ drawer: 'drawer', rail: 'rail' });

// The button of each destination lives inside Paper's Drawer item, which accepts no `aria-*` for it, and
// react-native-web drops the `accessibilityState.selected` Paper does set. On the web the selected
// destination's button is marked `aria-current="page"` on the DOM after each render; the items are found
// by the `data-side-nav-item` attribute SideNav puts on their wrappers (web only), so a header's buttons
// are never touched.
const syncAriaCurrent = (root, activeIndex) => {
    if (!root?.querySelectorAll) {
        return;
    }
    root.querySelectorAll('[data-side-nav-item]').forEach((item) => {
        const button = item.querySelector('[role="button"]');
        if (!button) {
            return;
        }
        if (Number(item.getAttribute('data-side-nav-item')) === activeIndex) {
            button.setAttribute('aria-current', 'page');
        } else {
            button.removeAttribute('aria-current');
        }
    });
};

// Consecutive items that name the same `section` form one group, in order; items without a section form
// their own group. The index of an item in `menuItems` never changes: the groups only decide where a
// section title (expanded) or a divider (collapsed) is drawn.
const groupsOf = (menuItems) =>
    menuItems.reduce((groups, item, index) => {
        const last = groups[groups.length - 1];
        if (last && last.section === item.section) {
            last.entries.push({ item, index });
        } else {
            groups.push({ section: item.section, entries: [{ item, index }] });
        }
        return groups;
    }, []);

/**
 * `menuItems`: `[{ key?, title, icon, badge?, section?, testID?, accessibilityLabel? }]`. An item is active
 * when its `key` equals `selectedKey`, or — without `selectedKey` — when its index equals `selectedIndex`.
 * `renderHeader` draws above the items (a FAB, say).
 *
 * `section` groups destinations the MD3 way: consecutive items with the same section label are one group.
 * Expanded, each group with a label is a `Drawer.Section` titled by it; collapsed, a `Divider` separates
 * the groups (the rail shows no titles). Items without a section are drawn as before.
 *
 * `variant`: `'drawer'` (default) keeps the app drawer's layout, where the first destination stands apart
 * from the rest (a 56dp gap under it); `'rail'` is the MD3 navigation rail, every destination evenly
 * spaced (Paper's 12dp) under the header group. `accessibilityRole` / `accessibilityLabel` / `testID` go
 * on the container (a rail is `accessibilityRole="navigation"`).
 */
const SideNav = ({
    isExpanded,
    menuItems = [],
    selectedIndex,
    selectedKey,
    onPress,
    renderHeader,
    variant = SIDE_NAV_VARIANTS.drawer,
    accessibilityRole,
    accessibilityLabel,
    testID,
}) => {
    const rootRef = useRef(null);
    const isActive = (item, index) => (selectedKey !== undefined ? item.key === selectedKey : selectedIndex === index);
    const activeIndex = menuItems.findIndex(isActive);
    const web = isWeb();
    const groups = groupsOf(menuItems);
    const grouped = groups.some((group) => group.section !== undefined);

    useEffect(() => {
        if (web) {
            syncAriaCurrent(rootRef.current, activeIndex);
        }
    });

    const itemProps = (item, index) => ({
        ...(item.testID !== undefined && { testID: item.testID }),
        ...(item.accessibilityLabel !== undefined && { accessibilityLabel: item.accessibilityLabel }),
        ...(web && { dataSet: { sideNavItem: String(index) } }),
    });

    const containerProps = {
        ...accessibilityProps({ role: accessibilityRole, label: accessibilityLabel }),
        ...(testID !== undefined && { testID }),
    };

    const expandedItem = (item, index) => (
        <Drawer.Item
            key={item.key ?? index}
            label={item.title}
            icon={item.icon}
            active={isActive(item, index)}
            onPress={() => onPress(item)}
            {...itemProps(item, index)}
        />
    );

    const collapsedItem = (item, index) => {
        const { dataSet, ...collapsedItemProps } = itemProps(item, index);
        return (
            <View
                key={item.key ?? index}
                style={index === 0 && variant !== SIDE_NAV_VARIANTS.rail ? styles.destinationItemHeight : null}
                {...(dataSet && { dataSet })}
            >
                <Drawer.CollapsedItem
                    label={item.title}
                    focusedIcon={item.icon}
                    badge={item.badge}
                    active={isActive(item, index)}
                    onPress={() => onPress(item)}
                    {...collapsedItemProps}
                />
            </View>
        );
    };

    const expandedGroups = () =>
        groups.map((group, position) =>
            group.section === undefined ? (
                group.entries.map(({ item, index }) => expandedItem(item, index))
            ) : (
                <Drawer.Section
                    key={`section-${group.section}-${position}`}
                    title={group.section}
                    showDivider={position < groups.length - 1}
                >
                    {group.entries.map(({ item, index }) => expandedItem(item, index))}
                </Drawer.Section>
            )
        );

    const collapsedGroups = () =>
        groups.map((group, position) => (
            <React.Fragment key={`group-${group.section ?? 'none'}-${position}`}>
                {position > 0 ? <Divider style={styles.groupDivider} /> : null}
                {group.entries.map(({ item, index }) => collapsedItem(item, index))}
            </React.Fragment>
        ));

    let items;
    if (grouped) {
        items = isExpanded ? expandedGroups() : collapsedGroups();
    } else {
        items = isExpanded
            ? menuItems.map((item, index) => expandedItem(item, index))
            : menuItems.map((item, index) => collapsedItem(item, index));
    }

    return (
        <View ref={rootRef} style={{ paddingTop: MD3LightTheme.spacing.x8 }} {...containerProps}>
            {renderHeader ? renderHeader() : null}
            {items}
        </View>
    );
};

const styles = {
    // The app's collapsed drawer sets its first destination apart from the rest; an MD3 rail does not.
    destinationItemHeight: {
        marginBottom: MD3LightTheme.spacing.x14,
    },
    // A group divider in the rail is the MD3 full-width one, with the rail's own spacing around it.
    groupDivider: {
        marginVertical: MD3LightTheme.spacing.x2,
    },
    centerAligned: {
        paddingTop: MD3LightTheme.spacing.x4,
        flex: 1,
        justifyContent: 'center',
    },
};

export default SideNav;
