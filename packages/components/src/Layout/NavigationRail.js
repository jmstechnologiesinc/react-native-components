import React from 'react';
import { StyleSheet, View } from 'react-native';

import { FAB, IconButton, useTheme } from '@jmstechnologiesinc/react-native-paper';

import { localized } from '../Localization/Localization';
import SideNav, { SIDE_NAV_VARIANTS } from '../SideNav/SideNav';

import { paneMetrics } from './metrics';

/**
 * @typedef {object} RailItem
 * @property {string} key
 * @property {string} label
 * @property {string} icon MaterialCommunityIcons name
 * @property {string|number|boolean} [badge]
 * @property {string} [accessibilityLabel] the destination's accessible name (defaults to `label`; say the
 *     badge in it: «Queue, 3 tasks»)
 */

/**
 * The MD3 navigation rail (80dp, `paneMetrics.rail`, on `elevation.level3`): an optional menu button and
 * FAB on top, then the destinations. Built on `SideNav variant="rail"` (evenly spaced destinations, the
 * `navigation` landmark, `aria-current="page"` on the active destination on the web) and Paper's `FAB`
 * (`mode="flat"`, `variant="tertiary"`; disabled while `loading`). The host decides which items exist and
 * what selecting one does.
 *
 * @param {{items: RailItem[], activeKey?: string, onSelect: (item: RailItem) => void,
 *     fab?: {icon: string, label: string, onPress: () => void, loading?: boolean, disabled?: boolean},
 *     menu?: {icon?: string, label: string, onPress: () => void}, accessibilityLabel?: string,
 *     testID?: string}} props `accessibilityLabel` names the landmark (default `global.navigation`);
 *     testIDs `<testID>` (the landmark), `<testID>-item-<key>`, `<testID>-fab`, `<testID>-menu`
 *     (default `rail`)
 */
const NavigationRail = ({ items, activeKey, onSelect, fab, menu, accessibilityLabel, testID = 'rail' }) => {
    const theme = useTheme();
    const { spacing, colors } = theme;

    const renderHeader = () =>
        menu || fab ? (
            <View style={[styles.header, { gap: spacing.x1, marginBottom: spacing.x6 }]}>
                {menu ? (
                    <IconButton
                        icon={menu.icon ?? 'menu'}
                        accessibilityLabel={menu.label}
                        onPress={menu.onPress}
                        testID={`${testID}-menu`}
                    />
                ) : null}
                {fab ? (
                    <FAB
                        icon={fab.icon}
                        accessibilityLabel={fab.label}
                        loading={fab.loading}
                        disabled={fab.disabled || fab.loading}
                        onPress={fab.onPress}
                        mode="flat"
                        variant="tertiary"
                        testID={`${testID}-fab`}
                    />
                ) : null}
            </View>
        ) : null;

    return (
        <View style={[styles.rail, { width: paneMetrics(theme).rail, backgroundColor: colors.elevation.level3 }]}>
            <SideNav
                variant={SIDE_NAV_VARIANTS.rail}
                isExpanded={false}
                menuItems={items.map((item) => ({
                    key: item.key,
                    title: item.label,
                    icon: item.icon,
                    badge: item.badge,
                    accessibilityLabel: item.accessibilityLabel ?? item.label,
                    testID: `${testID}-item-${item.key}`,
                }))}
                selectedKey={activeKey ?? null}
                onPress={(selected) => onSelect(items.find((candidate) => candidate.key === selected.key))}
                renderHeader={renderHeader}
                accessibilityRole="navigation"
                accessibilityLabel={accessibilityLabel ?? localized('global.navigation')}
                testID={testID}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    rail: {
        alignItems: 'center',
    },
    header: {
        alignItems: 'center',
    },
});

export default NavigationRail;
