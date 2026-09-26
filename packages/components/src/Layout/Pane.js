import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '@jmstechnologiesinc/react-native-paper';

import { paneMetrics } from './metrics';
import { usePaneContext } from './PaneContext';

/**
 * One MD3 pane: a `surface` region with 16dp corners (`paneMetrics.paneRadius`), meant for a window
 * painted `elevation.level3` (the host's). Inside a sheet it is flat (the sheet is the surface). Its size
 * comes from the PaneLayout slot. A `region` landmark named by `accessibilityLabel`.
 *
 * @param {{children?: React.ReactNode, accessibilityLabel?: string, style?: any, testID?: string}} props
 */
const Pane = ({ children, accessibilityLabel, style, testID }) => {
    const theme = useTheme();
    const { inSheet } = usePaneContext();
    return (
        <View
            role="region"
            aria-label={accessibilityLabel}
            testID={testID}
            style={[
                styles.pane,
                !inSheet && { backgroundColor: theme.colors.surface, borderRadius: paneMetrics(theme).paneRadius },
                style,
            ]}
        >
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    pane: {
        flex: 1,
        overflow: 'hidden',
    },
});

export default Pane;
