import React from 'react';
import { Pressable, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';

import { Portal, Surface, useTheme } from '@jmstechnologiesinc/react-native-paper';

import { BOTTOM_SHEET_MAX_HEIGHT, paneMetrics } from './metrics';
import SheetHeader from './SheetHeader';
import { useSheetDismiss } from './useSheetDismiss';

/**
 * An MD3 modal bottom sheet (Paper has none; the app's gorhom sheet is native-only): a Paper `Portal`
 * with a scrim and a `Surface` at most 640dp wide and 85% of the window tall, 28dp top corners and a drag
 * handle (`paneMetrics`). PaneLayout uses it for the supporting pane of L2B on medium and compact windows.
 * The handle is decorative: the sheet does not drag.
 *
 * Same contract as `SideSheet`: without `title` no header; scrim press dismisses; on the web a modal
 * dialog with `useModalFocus`; on Android the back button dismisses it. Needs Paper's `Provider`.
 *
 * @param {{visible: boolean, onDismiss: () => void, title?: string, accessibilityLabel?: string,
 *     closeLabel?: string, children?: React.ReactNode, testID?: string}} props testIDs: `<testID>`,
 *     `<testID>-scrim`, `<testID>-handle`; default `bottom-sheet`
 */
const BottomSheet = ({
    visible,
    onDismiss,
    title,
    accessibilityLabel,
    closeLabel,
    children,
    testID = 'bottom-sheet',
}) => {
    const theme = useTheme();
    const metrics = paneMetrics(theme);
    const window = useWindowDimensions();
    const containerRef = useSheetDismiss({ visible, onDismiss });
    if (!visible) return null;

    return (
        <Portal>
            <View style={[StyleSheet.absoluteFill, styles.anchor]}>
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
                            // Sizes from the window, not percentages: on iOS Paper's Surface nests the
                            // surface two layers in, where a percentage has nothing to resolve against.
                            width: Math.min(metrics.bottomSheetMaxWidth, window.width),
                            maxHeight: window.height * BOTTOM_SHEET_MAX_HEIGHT,
                            borderTopLeftRadius: metrics.bottomSheetRadius,
                            borderTopRightRadius: metrics.bottomSheetRadius,
                            backgroundColor: theme.colors.elevation.level1,
                        },
                    ]}
                >
                    <View
                        testID={`${testID}-handle`}
                        style={[
                            styles.handle,
                            {
                                width: metrics.dragHandle.width,
                                height: metrics.dragHandle.height,
                                borderRadius: metrics.dragHandle.height / 2,
                                backgroundColor: theme.colors.onSurfaceVariant,
                                marginTop: theme.spacing.x4,
                            },
                        ]}
                    />
                    {title ? <SheetHeader title={title} onClose={onDismiss} closeLabel={closeLabel} /> : null}
                    <ScrollView contentContainerStyle={styles.content}>{children}</ScrollView>
                </Surface>
            </View>
        </Portal>
    );
};

const styles = StyleSheet.create({
    anchor: {
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    sheet: {
        overflow: 'hidden',
    },
    handle: {
        alignSelf: 'center',
        opacity: 0.4,
    },
    content: {
        flexGrow: 1,
    },
});

export default BottomSheet;
