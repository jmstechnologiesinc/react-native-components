import React from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';

import { Portal, Surface, useTheme } from '@jmstechnologiesinc/react-native-paper';

import { paneMetrics } from './metrics';
import SheetHeader from './SheetHeader';
import { useSheetDismiss } from './useSheetDismiss';

/**
 * An MD3 modal side sheet anchored to the trailing edge (Paper has none): a Paper `Portal` with a scrim
 * and a `Surface` 360dp wide (`paneMetrics`). PaneLayout uses it for the supporting pane of L3 below XL.
 *
 * Without `title` the sheet draws no header of its own (the pane inside brings its `PaneHeader`, which
 * adds the close button). The scrim dismisses on press (a pointer affordance: it is hidden from assistive
 * technology). On the web it is a modal dialog (`role="dialog"`, `aria-modal`, `aria-label` = `title` or
 * `accessibilityLabel`) with `useModalFocus`'s keyboard contract; on Android the back button dismisses it.
 * Needs Paper's `Provider` (the Portal host).
 *
 * @param {{visible: boolean, onDismiss: () => void, title?: string, accessibilityLabel?: string,
 *     closeLabel?: string, children?: React.ReactNode, testID?: string}} props testIDs: `<testID>` (the
 *     sheet), `<testID>-scrim`; default `side-sheet`
 */
const SideSheet = ({ visible, onDismiss, title, accessibilityLabel, closeLabel, children, testID = 'side-sheet' }) => {
    const theme = useTheme();
    const metrics = paneMetrics(theme);
    const window = useWindowDimensions();
    const containerRef = useSheetDismiss({ visible, onDismiss });
    if (!visible) return null;

    return (
        <Portal>
            <View style={StyleSheet.absoluteFill}>
                <Pressable
                    testID={`${testID}-scrim`}
                    focusable={false}
                    aria-hidden
                    onPress={onDismiss}
                    style={[StyleSheet.absoluteFill, { backgroundColor: theme.colors.backdrop }]}
                />
                <Surface
                    ref={containerRef}
                    testID={testID}
                    role="dialog"
                    aria-modal
                    aria-label={title ?? accessibilityLabel}
                    elevation={1}
                    style={[
                        styles.sheet,
                        {
                            width: Math.min(metrics.sideSheetWidth, window.width),
                            // On iOS Paper's Surface moves `top`/`bottom` to an outer shadow layer, and the
                            // surface itself (two layers in) cannot stretch to it: it is given the height.
                            ...(Platform.OS === 'ios' && { height: window.height }),
                            borderTopLeftRadius: metrics.sideSheetRadius,
                            borderBottomLeftRadius: metrics.sideSheetRadius,
                            backgroundColor: theme.colors.elevation.level1,
                        },
                    ]}
                >
                    {title ? <SheetHeader title={title} onClose={onDismiss} closeLabel={closeLabel} /> : null}
                    <ScrollView contentContainerStyle={styles.content}>{children}</ScrollView>
                </Surface>
            </View>
        </Portal>
    );
};

const styles = StyleSheet.create({
    sheet: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
    },
    content: {
        flexGrow: 1,
    },
});

export default SideSheet;
