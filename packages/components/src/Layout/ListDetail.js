import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { IconButton, Text, useTheme } from '@jmstechnologiesinc/react-native-paper';

import { localized } from '../Localization/Localization';
import { paneMetrics, SIZE_CLASS } from './metrics';
import { useWindowSizeClass } from './useWindowSizeClass';

const WIDE = new Set([SIZE_CLASS.EXPANDED, SIZE_CLASS.LARGE, SIZE_CLASS.EXTRA_LARGE]);

/**
 * Whether a list column and a detail column fit side by side in `width`: the detail at least as wide as the
 * fixed list (MD3 list-detail: the flexible pane is the wider one).
 *
 * @param {number} width the block's own width
 * @param {ReturnType<typeof paneMetrics>} metrics
 * @returns {boolean}
 */
export const fitsListDetail = (width, metrics) => width - metrics.spacer - metrics.fixedPane >= metrics.fixedPane;

/**
 * MD3 list-detail INSIDE a pane (a section of a record, say), not across the window (that is `PaneLayout`):
 * a fixed-width list column (`paneMetrics.fixedPane`) beside a flexible detail column when the block's
 * measured width fits both, else one at a time — the list, or, with `showDetail`, the detail under a back
 * row that calls `onBack` (MD3: on narrow widths the detail replaces the list). Until it is measured, the
 * window's size class decides. Content that supports the detail (a validation, the case facts) goes in the
 * detail slot, under the focus content: a supporting pane adapts below its focus content where a third
 * column would not fit.
 *
 * The block does not scroll: it lays its columns out in the host's scroll.
 *
 * @param {{list: React.ReactNode, detail: React.ReactNode, showDetail?: boolean, onBack?: () => void,
 *     listLabel?: string, detailLabel?: string, backLabel?: string, testID?: string}} props `listLabel` and
 *     `detailLabel` name the columns (`region`s); `backLabel` defaults to «Back to <listLabel>» (`global.backTo`,
 *     else `global.back`); testIDs `<testID>`,
 *     `<testID>-list`, `<testID>-detail`, `<testID>-back` (default `list-detail`)
 */
const ListDetail = ({
    list,
    detail,
    showDetail = false,
    onBack,
    listLabel,
    detailLabel,
    backLabel,
    testID = 'list-detail',
}) => {
    const theme = useTheme();
    const metrics = paneMetrics(theme);
    const { sizeClass } = useWindowSizeClass();
    const [measuredWidth, setMeasuredWidth] = useState(null);
    const onLayout = useCallback((event) => setMeasuredWidth(event.nativeEvent.layout.width), []);
    const sideBySide = measuredWidth === null ? WIDE.has(sizeClass) : fitsListDetail(measuredWidth, metrics);

    const listColumn = (
        <View
            role="region"
            aria-label={listLabel}
            style={sideBySide && [styles.fixed, { width: metrics.fixedPane }]}
            testID={`${testID}-list`}
        >
            {list}
        </View>
    );
    const detailColumn = (
        <View role="region" aria-label={detailLabel} style={sideBySide && styles.flex} testID={`${testID}-detail`}>
            {!sideBySide && onBack ? (
                <View style={[styles.back, { marginBottom: theme.spacing.x2 }]}>
                    <IconButton
                        icon="arrow-left"
                        // Named after the list: a pane header beside it may carry a plain «Back» of its own.
                        accessibilityLabel={
                            backLabel ??
                            (listLabel ? localized('global.backTo', { name: listLabel }) : localized('global.back'))
                        }
                        onPress={onBack}
                        testID={`${testID}-back`}
                    />
                    {listLabel ? (
                        <Text variant="titleMedium" numberOfLines={1} style={styles.backTitle}>
                            {listLabel}
                        </Text>
                    ) : null}
                </View>
            ) : null}
            {detail}
        </View>
    );

    return (
        <View onLayout={onLayout} style={sideBySide && [styles.row, { gap: metrics.spacer }]} testID={testID}>
            {sideBySide ? (
                <>
                    {listColumn}
                    {detailColumn}
                </>
            ) : showDetail ? (
                detailColumn
            ) : (
                listColumn
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        minWidth: 0,
    },
    fixed: {
        flexShrink: 0,
    },
    flex: {
        flex: 1,
        minWidth: 0,
    },
    back: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backTitle: {
        flex: 1,
    },
});

export default ListDetail;
