import React, { useEffect, useRef } from 'react';

import { View } from 'react-native';

import { Drawer, MD3LightTheme } from '@jmstechnologiesinc/react-native-paper';

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

/**
 * `menuItems`: `[{ key?, title, icon, badge?, testID?, accessibilityLabel? }]`. An item is active when its
 * `key` equals `selectedKey`, or — without `selectedKey` — when its index equals `selectedIndex`.
 * `renderHeader` draws above the items (a FAB, say).
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

    return (
        <View ref={rootRef} style={{ paddingTop: MD3LightTheme.spacing.x8 }} {...containerProps}>
            {renderHeader ? renderHeader() : null}
            {isExpanded
                ? menuItems.map((item, index) => (
                      <Drawer.Item
                          key={item.key ?? index}
                          label={item.title}
                          icon={item.icon}
                          active={isActive(item, index)}
                          onPress={() => onPress(item)}
                          {...itemProps(item, index)}
                      />
                  ))
                : menuItems.map((item, index) => {
                      const { dataSet, ...collapsedItemProps } = itemProps(item, index);
                      return (
                          <View
                              key={item.key ?? index}
                              style={
                                  index === 0 && variant !== SIDE_NAV_VARIANTS.rail
                                      ? styles.destinationItemHeight
                                      : null
                              }
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
                  })}
        </View>
    );
};

const styles = {
    // The app's collapsed drawer sets its first destination apart from the rest; an MD3 rail does not.
    destinationItemHeight: {
        marginBottom: MD3LightTheme.spacing.x14,
    },
    centerAligned: {
        paddingTop: MD3LightTheme.spacing.x4,
        flex: 1,
        justifyContent: 'center',
    },
};

export default SideNav;
