import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button, DataTable, Text, useTheme } from '@jmstechnologiesinc/react-native-paper';

import { localized } from '../Localization/Localization';
import { EMPTY_VALUE } from '../valueText';

/**
 * @typedef {object} DataColumn
 * @property {string} key
 * @property {string} title
 * @property {boolean} [numeric] right-aligned (Paper)
 * @property {boolean} [sortable]
 * @property {number} [flex] the column's share of the row (Paper's cells are `flex: 1`)
 * @property {(row: object) => React.ReactNode} [render] defaults to `row[key]`
 * @property {(row: object) => (string|number|null|undefined)} [sortValue] defaults to `row[key]`
 */

/** @typedef {{key: string, direction: 'ascending'|'descending'}} DataSort */

export const SORT_DIRECTION = Object.freeze({ ASCENDING: 'ascending', DESCENDING: 'descending' });

export const SORT_MODE = Object.freeze({ CLIENT: 'client', SERVER: 'server' });

const isBlank = (value) => value === undefined || value === null || value === '';

const compareValues = (a, b) => {
    if (isBlank(a) || isBlank(b)) return Number(isBlank(a)) - Number(isBlank(b));
    if (typeof a === 'number' && typeof b === 'number') return a - b;
    return String(a).localeCompare(String(b));
};

/**
 * Rows in display order for a column sort: stable, blanks last in both directions. Display only: it never
 * filters or decides anything. Without a sort, or for an unknown column, the rows come back as given.
 *
 * @param {object[]} rows
 * @param {?DataSort} sort
 * @param {DataColumn[]} columns
 * @returns {object[]}
 */
export const sortRows = (rows, sort, columns) => {
    const column = sort && columns.find((candidate) => candidate.key === sort.key);
    if (!column) return rows;
    const valueOf = column.sortValue ?? ((row) => row[column.key]);
    const sign = sort.direction === SORT_DIRECTION.DESCENDING ? -1 : 1;
    return rows
        .map((row, index) => ({ row, index, value: valueOf(row) }))
        .sort((a, b) => {
            if (isBlank(a.value) !== isBlank(b.value)) return compareValues(a.value, b.value);
            return sign * compareValues(a.value, b.value) || a.index - b.index;
        })
        .map(({ row }) => row);
};

/** The sort after pressing a column: ascending first, then toggling. */
export const nextSort = (sort, key) =>
    sort?.key === key && sort.direction === SORT_DIRECTION.ASCENDING
        ? { key, direction: SORT_DIRECTION.DESCENDING }
        : { key, direction: SORT_DIRECTION.ASCENDING };

/**
 * Paper `DataTable` (`Header`/`Title`, `Row`/`Cell`) with column sorting and cursor pagination («Load
 * more», never page numbers).
 *
 * - Sort is controlled with `sort` + `onSortChange`, or kept here from `defaultSort`. `sortMode="client"`
 *   sorts the rows here (`sortRows`); `"server"` shows them as given (the server ordered them).
 * - `hasMore`/`loadingMore`/`onLoadMore` map onto an infinite query (`hasNextPage`,
 *   `isFetchingNextPage`, `fetchNextPage`); the button is disabled and spinning while loading.
 * - `onRowPress` makes rows pressable; `selectedKey` paints that row `secondaryContainer` and marks it
 *   `aria-selected`. A blank cell shows an em dash. `emptyLabel` shows under the header without rows.
 *
 * @param {{columns: DataColumn[], rows: object[], rowKey: string | ((row: object) => string),
 *     sort?: ?DataSort, defaultSort?: ?DataSort, onSortChange?: (sort: DataSort) => void,
 *     sortMode?: 'client'|'server', onRowPress?: (row: object) => void, selectedKey?: string,
 *     hasMore?: boolean, loadingMore?: boolean, onLoadMore?: () => void, emptyLabel?: string,
 *     loadMoreLabel?: string, sortByLabel?: (columnTitle: string) => string, accessibilityLabel?: string,
 *     testID?: string}} props labels default to `global.loadMore` and `global.sortBy`; testIDs `<testID>`,
 *     `<testID>-title-<key>`, `<testID>-row-<rowKey>`, `<testID>-load-more`, `<testID>-empty` (default
 *     `data-table`)
 */
const DataTableView = ({
    columns,
    rows,
    rowKey,
    sort,
    defaultSort = null,
    onSortChange,
    sortMode = SORT_MODE.CLIENT,
    onRowPress,
    selectedKey,
    hasMore = false,
    loadingMore = false,
    onLoadMore,
    emptyLabel,
    loadMoreLabel,
    sortByLabel,
    accessibilityLabel,
    testID = 'data-table',
}) => {
    const { colors, spacing } = useTheme();
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

    return (
        <View role="table" aria-label={accessibilityLabel} testID={testID}>
            <DataTable>
                <DataTable.Header>
                    {columns.map((column) => {
                        const sorted = activeSort?.key === column.key ? activeSort.direction : undefined;
                        return (
                            <DataTable.Title
                                key={column.key}
                                numeric={column.numeric}
                                sortDirection={column.sortable ? sorted : undefined}
                                onPress={column.sortable ? () => onSort(column.key) : undefined}
                                style={column.flex ? { flex: column.flex } : undefined}
                                accessibilityRole={column.sortable ? 'button' : undefined}
                                accessibilityLabel={column.sortable ? sortLabel(column.title) : undefined}
                                testID={`${testID}-title-${column.key}`}
                            >
                                {column.title}
                            </DataTable.Title>
                        );
                    })}
                </DataTable.Header>
                {shown.map((row) => {
                    const key = keyOf(row);
                    const selected = selectedKey !== undefined && key === selectedKey;
                    return (
                        <DataTable.Row
                            key={key}
                            onPress={onRowPress ? () => onRowPress(row) : undefined}
                            style={selected ? { backgroundColor: colors.secondaryContainer } : undefined}
                            aria-selected={selected}
                            testID={`${testID}-row-${key}`}
                        >
                            {columns.map((column) => {
                                const content = column.render ? column.render(row) : row[column.key];
                                return (
                                    <DataTable.Cell
                                        key={column.key}
                                        numeric={column.numeric}
                                        style={column.flex ? { flex: column.flex } : undefined}
                                    >
                                        {isBlank(content) ? EMPTY_VALUE : content}
                                    </DataTable.Cell>
                                );
                            })}
                        </DataTable.Row>
                    );
                })}
            </DataTable>
            {!shown.length && emptyLabel ? (
                <Text
                    variant="bodyMedium"
                    style={[styles.center, { padding: spacing.x4, color: colors.onSurfaceVariant }]}
                    testID={`${testID}-empty`}
                >
                    {emptyLabel}
                </Text>
            ) : null}
            {hasMore ? (
                <Button
                    mode="text"
                    icon="chevron-down"
                    loading={loadingMore}
                    disabled={loadingMore}
                    onPress={onLoadMore}
                    style={[styles.more, { margin: spacing.x2 }]}
                    testID={`${testID}-load-more`}
                >
                    {loadMoreLabel ?? localized('global.loadMore')}
                </Button>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    center: {
        textAlign: 'center',
    },
    more: {
        alignSelf: 'center',
    },
});

export default DataTableView;
