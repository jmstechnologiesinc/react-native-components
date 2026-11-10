import React, { Children, useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '@jmstechnologiesinc/react-native-paper';

import { paneMetrics } from './metrics';
import { useWindowSizeClass } from './useWindowSizeClass';

/**
 * The columns of an MD3 feed (canonical layout «feed») in `width`: as many as fit at least
 * `paneMetrics.fixedPane` wide (MD3's 360 dp pane) with `gap` between them, never fewer than one, and
 * the width each one takes. A column is whole dp, so a row never overflows its width by a fraction and
 * wraps its last item.
 *
 * @param {number} width the width the columns share
 * @param {ReturnType<typeof paneMetrics>} metrics
 * @param {number} gap the space between two columns
 * @returns {{columns: number, itemWidth: number}}
 */
export const feedColumns = (width, metrics, gap) => {
    const columns = Math.max(1, Math.floor((width + gap) / (metrics.fixedPane + gap)));
    return { columns, itemWidth: Math.max(0, Math.floor((width - gap * (columns - 1)) / columns)) };
};

/**
 * The feed geometry of a block that measures itself: its `onLayout`, the `gap` between its items (both
 * ways) and its columns (`feedColumns`) in its width less `inset`, the horizontal space the block keeps
 * for itself. Until it is measured, the window's width decides, so a feed is laid out at its columns from
 * its first frame, and a rotation or a resized window lays it out again.
 *
 * @param {number} [inset] the block's own horizontal margins, both sides together
 * @returns {{columns: number, itemWidth: number, gap: number, onLayout: (event: object) => void}}
 */
export const useFeedColumns = (inset = 0) => {
    const theme = useTheme();
    const { width: windowWidth } = useWindowSizeClass();
    const [measuredWidth, setMeasuredWidth] = useState(null);
    const onLayout = useCallback((event) => setMeasuredWidth(event.nativeEvent.layout.width), []);
    const gap = theme.spacing.x4;
    return { ...feedColumns((measuredWidth ?? windowWidth) - inset, paneMetrics(theme), gap), gap, onLayout };
};

/**
 * MD3's feed canonical layout for a few items (cards): a grid of `feedColumns`, one column on a phone and
 * more where they fit, each item as wide as its column. A card never stretches across a wide window. The
 * block does not scroll: it lays its items out in the host's scroll. A long list scrolls virtualized with
 * `useFeedColumns` (VendorList).
 *
 * @param {{children: React.ReactNode, testID?: string}} props testIDs `<testID>` and `<testID>-item-<n>`
 *     (default `feed`)
 */
const Feed = ({ children, testID = 'feed' }) => {
    const { itemWidth, gap, onLayout } = useFeedColumns();
    return (
        <View onLayout={onLayout} style={[styles.grid, { gap }]} testID={testID}>
            {Children.toArray(children).map((child, index) => (
                <View key={child.key ?? index} style={{ width: itemWidth }} testID={`${testID}-item-${index}`}>
                    {child}
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
});

export default Feed;
