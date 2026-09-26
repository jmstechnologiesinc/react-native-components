import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Appbar, Text, useTheme } from '@jmstechnologiesinc/react-native-paper';

import { localized } from '../Localization/Localization';

import { SUPPORTING_MODE } from './metrics';
import { usePaneContext } from './PaneContext';

/**
 * @typedef {object} PaneAction
 * @property {string} icon MaterialCommunityIcons name
 * @property {string} label the accessible name (an icon button always carries one)
 * @property {() => void} onPress
 * @property {boolean} [disabled]
 * @property {string} [testID]
 */

/**
 * The top app bar of a pane, on Paper `Appbar` (not `Appbar.Header`: a pane has no status-bar inset).
 * From the enclosing PaneLayout it adds by itself the back arrow (single-pane windows, detail pane), the
 * button that opens a collapsed supporting pane (detail pane of L3, primary pane of L2B) and the close
 * button of a pane shown in a sheet. MD3 small app bar; the fork's `Appbar.Content` drops `subtitle` under
 * MD3, so the subtitle is drawn under the title here.
 *
 * @param {{title: string, subtitle?: string, onBack?: () => void, actions?: PaneAction[],
 *     trailing?: React.ReactNode, backLabel?: string, showSupportingLabel?: string, closeLabel?: string,
 *     testID?: string}} props labels default to `global.back`, `global.showSidePanel` and `global.close`;
 *     `onBack` shows the back arrow on any window (the layout's own appears only on single-pane windows)
 */
const PaneHeader = ({
    title,
    subtitle,
    onBack,
    actions = [],
    trailing,
    backLabel,
    showSupportingLabel,
    closeLabel,
    testID = 'pane-header',
}) => {
    const { colors, spacing } = useTheme();
    const pane = usePaneContext();
    const back = onBack ?? pane.onBack;

    return (
        <Appbar testID={testID} style={{ backgroundColor: pane.inSheet ? colors.elevation.level1 : colors.surface }}>
            {back ? (
                <Appbar.BackAction
                    accessibilityLabel={backLabel ?? localized('global.back')}
                    onPress={back}
                    testID={`${testID}-back`}
                />
            ) : null}
            <View style={[styles.titles, !back && { paddingHorizontal: spacing.x2 }]}>
                <Appbar.Content title={title} style={styles.content} />
                {subtitle ? (
                    <Text
                        variant="bodySmall"
                        numberOfLines={1}
                        style={{ color: colors.onSurfaceVariant, paddingHorizontal: spacing.x3 }}
                    >
                        {subtitle}
                    </Text>
                ) : null}
            </View>
            {actions.map((action) => (
                <Appbar.Action
                    key={action.label}
                    icon={action.icon}
                    accessibilityLabel={action.label}
                    disabled={action.disabled}
                    onPress={action.onPress}
                    testID={action.testID}
                />
            ))}
            {trailing}
            {pane.onShowSupporting ? (
                <Appbar.Action
                    icon={pane.supportingMode === SUPPORTING_MODE.BOTTOM_SHEET ? 'dock-bottom' : 'dock-right'}
                    accessibilityLabel={showSupportingLabel ?? localized('global.showSidePanel')}
                    onPress={pane.onShowSupporting}
                    testID={`${testID}-show-supporting`}
                />
            ) : null}
            {pane.onCloseSheet ? (
                <Appbar.Action
                    icon="close"
                    accessibilityLabel={closeLabel ?? localized('global.close')}
                    onPress={pane.onCloseSheet}
                    testID={`${testID}-close`}
                />
            ) : null}
        </Appbar>
    );
};

const styles = StyleSheet.create({
    titles: {
        flex: 1,
        justifyContent: 'center',
        minWidth: 0,
    },
    content: {
        flex: 0,
    },
});

export default PaneHeader;
