import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '@jmstechnologiesinc/react-native-paper';

import BottomSheet from './BottomSheet';
import { LAYOUT, PANE, SUPPORTING_MODE, paneMetrics } from './metrics';
import { PaneContext } from './PaneContext';
import { paneArrangement } from './paneArrangement';
import SideSheet from './SideSheet';
import { useWindowSizeClass } from './useWindowSizeClass';

const FIXED_WIDTH_PANES = new Set([PANE.LIST, PANE.SUPPORTING]);

/**
 * The MD3 pane scaffold a screen declares: `L3` (list · detail · supporting), `L2A` (list · detail) or
 * `L2B` (primary · supporting), collapsing per window size class (`paneArrangement`).
 *
 * - Single-pane windows show `activePane` (list | detail); the detail pane's `PaneHeader` gets a back
 *   arrow that calls `onBack`.
 * - A collapsed supporting pane opens in a `SideSheet` (L3) or a `BottomSheet` (L2B) from a button that
 *   `PaneHeader` adds to the detail/primary pane. `supportingOpen`/`onToggleSupporting` control it;
 *   without `supportingOpen` the layout keeps its own state (and still reports through the callback).
 * - A slot left empty (`undefined`/`null`) takes no room.
 *
 * Slots are usually `<Pane>`s; the layout sizes them (list and supporting 360dp in the theme's tokens,
 * the rest flex), spaces them by 24dp, pads the window by 24dp and tells each its role
 * (`usePaneContext`). The window's background is the host's (MD3: `elevation.level3`).
 *
 * @param {{layout: string, list?: React.ReactNode, detail?: React.ReactNode, primary?: React.ReactNode,
 *     supporting?: React.ReactNode, activePane?: string, onBack?: () => void, supportingOpen?: boolean,
 *     onToggleSupporting?: (open: boolean) => void, supportingLabel?: string, testID?: string}} props
 *     `supportingLabel` names the sheet; testIDs `<testID>`, `<testID>-<pane>`, `<testID>-supporting-sheet`
 *     (default `pane-layout`)
 */
const PaneLayout = ({
    layout,
    list,
    detail,
    primary,
    supporting,
    activePane,
    onBack,
    supportingOpen,
    onToggleSupporting,
    supportingLabel,
    testID = 'pane-layout',
}) => {
    const metrics = paneMetrics(useTheme());
    const { sizeClass } = useWindowSizeClass();
    const arrangement = paneArrangement(layout, sizeClass, activePane);
    const [ownOpen, setOwnOpen] = useState(false);
    const open = supportingOpen ?? ownOpen;
    const setOpen = useCallback(
        (next) => {
            if (supportingOpen === undefined) setOwnOpen(next);
            onToggleSupporting?.(next);
        },
        [onToggleSupporting, supportingOpen]
    );
    const showSupporting = useCallback(() => setOpen(true), [setOpen]);
    const closeSupporting = useCallback(() => setOpen(false), [setOpen]);

    const slots = { [PANE.LIST]: list, [PANE.DETAIL]: detail, [PANE.PRIMARY]: primary, [PANE.SUPPORTING]: supporting };
    const collapsedSupporting =
        supporting !== undefined &&
        supporting !== null &&
        (arrangement.supporting === SUPPORTING_MODE.SIDE_SHEET ||
            arrangement.supporting === SUPPORTING_MODE.BOTTOM_SHEET);
    // The pane that carries the «show supporting» button: detail in L3, primary in L2B.
    const toggleHost = layout === LAYOUT.L2B ? PANE.PRIMARY : PANE.DETAIL;

    const contextOf = useMemo(
        () => (role, inSheet) => ({
            role,
            inSheet,
            onBack: arrangement.single && role === PANE.DETAIL && onBack ? onBack : null,
            onShowSupporting: collapsedSupporting && role === toggleHost ? showSupporting : null,
            onCloseSheet: inSheet ? closeSupporting : null,
            supportingMode: arrangement.supporting,
        }),
        [
            arrangement.single,
            arrangement.supporting,
            closeSupporting,
            collapsedSupporting,
            onBack,
            showSupporting,
            toggleHost,
        ]
    );

    const Sheet = arrangement.supporting === SUPPORTING_MODE.BOTTOM_SHEET ? BottomSheet : SideSheet;
    const panes = arrangement.panes.filter((role) => slots[role] !== undefined && slots[role] !== null);

    return (
        <View style={[styles.window, { padding: metrics.margin }]} testID={testID}>
            {panes.map((role, index) => (
                <View
                    key={role}
                    testID={`${testID}-${role}`}
                    style={[
                        FIXED_WIDTH_PANES.has(role) && !arrangement.single
                            ? [styles.fixed, { width: metrics.fixedPane }]
                            : styles.flex,
                        index > 0 && { marginLeft: metrics.spacer },
                    ]}
                >
                    <PaneContext.Provider value={contextOf(role, false)}>{slots[role]}</PaneContext.Provider>
                </View>
            ))}
            {collapsedSupporting ? (
                <Sheet
                    visible={open}
                    onDismiss={closeSupporting}
                    accessibilityLabel={supportingLabel}
                    testID={`${testID}-${PANE.SUPPORTING}-sheet`}
                >
                    <PaneContext.Provider value={contextOf(PANE.SUPPORTING, true)}>{supporting}</PaneContext.Provider>
                </Sheet>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    window: {
        flex: 1,
        flexDirection: 'row',
        minWidth: 0,
    },
    fixed: {
        flexShrink: 0,
    },
    flex: {
        flex: 1,
        minWidth: 0,
    },
});

export default PaneLayout;
