import React, { useCallback, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { ActivityIndicator, Button, DataTable, Text, useTheme } from '@jmstechnologiesinc/react-native-paper';

import { localized } from '../Localization/Localization';

import { nextSort, SORT_MODE, sortRows } from './DataTableView';
import { TableHeader, TableRow } from './tableParts';

/**
 * Paper `DataTable` on a `FlatList`, for a long directory: the rows are virtualized and the next page loads
 * as the person scrolls near the end (React Native's `onEndReached` over the host's cursor), never with a
 * page number and never with a button while more can load. The header stays put while the rows scroll.
 * Same column model and sorting as `DataTableView` (`DataColumn`, `sortRows`).
 *
 * - `hasMore`/`loadingMore`/`onLoadMore` are the host's cursor. While a page loads the footer shows a
 *   progress indicator; when a page fails (`loadMoreFailed`) the footer says so beside a Retry that calls
 *   `onLoadMore` again — nothing loads by itself after a failure.
 * - `initialNumToRender` (a page's size, say) keeps the first page whole on screen before virtualization starts.
 * - Rows are `rowHeight` tall (MD3 data table row: 48dp, `spacing.x12`), which lets the list place them
 *   without measuring (`getItemLayout`): the row's content must fit that height (a chip does).
 * - `onRowPress` makes rows pressable, named by `rowAccessibilityLabel(row)`; `selectedKey` marks one.
 * - On the web it is an ARIA table (the fork's roles) named `accessibilityLabel`; the list takes the pane's
 *   remaining height (`flex: 1`), so the host gives it a bounded box.
 *
 * @param {{columns: import('./DataTableView').DataColumn[], rows: object[], rowKey: string | ((row: object) => string),
 *     sort?: ?import('./DataTableView').DataSort, defaultSort?: ?import('./DataTableView').DataSort,
 *     onSortChange?: (sort: object) => void, sortMode?: 'client'|'server', onRowPress?: (row: object) => void,
 *     rowAccessibilityLabel?: (row: object) => string, selectedKey?: string, hasMore?: boolean,
 *     loadingMore?: boolean, loadMoreFailed?: boolean, onLoadMore?: () => void, loadMoreFailedLabel?: string,
 *     emptyLabel?: string, rowHeight?: number, endReachedThreshold?: number, initialNumToRender?: number,
 *     sortByLabel?: (title: string) => string,
 *     accessibilityLabel?: string, style?: any, testID?: string}} props testIDs `<testID>`, `<testID>-list`,
 *     `<testID>-title-<key>`, `<testID>-row-<rowKey>`, `<testID>-loading-more`, `<testID>-load-more-failed`,
 *     `<testID>-retry`, `<testID>-empty` (default `data-table`)
 */
const DataTableList = ({
    columns,
    rows,
    rowKey,
    sort,
    defaultSort = null,
    onSortChange,
    sortMode = SORT_MODE.CLIENT,
    onRowPress,
    rowAccessibilityLabel,
    selectedKey,
    hasMore = false,
    loadingMore = false,
    loadMoreFailed = false,
    onLoadMore,
    loadMoreFailedLabel,
    emptyLabel,
    rowHeight,
    endReachedThreshold = 0.5,
    initialNumToRender,
    sortByLabel,
    accessibilityLabel,
    style,
    testID = 'data-table',
}) => {
    const { colors, spacing } = useTheme();
    const height = rowHeight ?? spacing.x12;
    const [ownSort, setOwnSort] = useState(defaultSort);
    const activeSort = sort === undefined ? ownSort : sort;
    const keyOf = typeof rowKey === 'function' ? rowKey : (row) => row[rowKey];
    const shown = sortMode === SORT_MODE.CLIENT ? sortRows(rows, activeSort, columns) : rows;
    const sortLabel = (title) => (sortByLabel ? sortByLabel(title) : localized('global.sortBy', { column: title }));
    const onSort = (key) => {
        const next = nextSort(activeSort, key);
        if (sort === undefined) setOwnSort(next);
        onSortChange?.(next);
    };
    // A page is asked for once per approach to the end: not while one loads, and not again after a failure
    // until Retry (the person decides when to try the network again).
    const onEndReached = useCallback(() => {
        if (hasMore && !loadingMore && !loadMoreFailed) onLoadMore?.();
    }, [hasMore, loadMoreFailed, loadingMore, onLoadMore]);
    const getItemLayout = useCallback((_data, index) => ({ length: height, offset: height * index, index }), [height]);
    const renderItem = useCallback(
        ({ item }) => {
            const key = keyOf(item);
            return (
                <TableRow
                    columns={columns}
                    row={item}
                    selected={selectedKey !== undefined && key === selectedKey}
                    onPress={onRowPress ? () => onRowPress(item) : undefined}
                    accessibilityLabel={rowAccessibilityLabel ? rowAccessibilityLabel(item) : undefined}
                    testID={`${testID}-row-${key}`}
                />
            );
        },
        // `keyOf` is derived from `rowKey`, a prop.
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [columns, onRowPress, rowAccessibilityLabel, rowKey, selectedKey, testID]
    );

    let footer = null;
    if (loadingMore) {
        footer = (
            <View style={{ padding: spacing.x4 }} testID={`${testID}-loading-more`}>
                <ActivityIndicator animating accessibilityLabel={localized('global.loading')} />
            </View>
        );
    } else if (loadMoreFailed) {
        footer = (
            <View role="alert" style={[styles.footer, { padding: spacing.x2, gap: spacing.x2 }]}>
                <Text variant="bodyMedium" style={{ color: colors.error }} testID={`${testID}-load-more-failed`}>
                    {loadMoreFailedLabel ?? localized('global.somethingWentWrong')}
                </Text>
                <Button mode="text" icon="refresh" onPress={onLoadMore} testID={`${testID}-retry`}>
                    {localized('global.retry')}
                </Button>
            </View>
        );
    }

    return (
        <DataTable aria-label={accessibilityLabel} style={[styles.table, style]} testID={testID}>
            <FlatList
                data={shown}
                keyExtractor={keyOf}
                renderItem={renderItem}
                getItemLayout={getItemLayout}
                ListHeaderComponent={
                    <TableHeader
                        columns={columns}
                        sort={activeSort}
                        onSort={onSort}
                        sortLabel={sortLabel}
                        testID={testID}
                    />
                }
                stickyHeaderIndices={[0]}
                ListEmptyComponent={
                    emptyLabel ? (
                        <Text
                            variant="bodyMedium"
                            style={[styles.center, { padding: spacing.x4, color: colors.onSurfaceVariant }]}
                            testID={`${testID}-empty`}
                        >
                            {emptyLabel}
                        </Text>
                    ) : null
                }
                ListFooterComponent={footer}
                onEndReached={onEndReached}
                onEndReachedThreshold={endReachedThreshold}
                initialNumToRender={initialNumToRender}
                style={styles.list}
                testID={`${testID}-list`}
            />
        </DataTable>
    );
};

const styles = StyleSheet.create({
    table: {
        flex: 1,
        minHeight: 0,
    },
    list: {
        flex: 1,
    },
    center: {
        textAlign: 'center',
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
    },
});

export default DataTableList;
