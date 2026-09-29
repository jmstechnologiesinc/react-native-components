import React from 'react';

import { DataTable, useTheme } from '@jmstechnologiesinc/react-native-paper';

import { EMPTY_VALUE } from '../valueText';

export const isBlank = (value) => value === undefined || value === null || value === '';

/**
 * The header row of a data table: one `DataTable.Title` per column; a sortable one is a button named
 * `sortLabel(title)` and says its direction (`aria-sort`).
 *
 * @param {{columns: import('./DataTableView').DataColumn[], sort?: ?import('./DataTableView').DataSort,
 *     onSort: (key: string) => void, sortLabel: (title: string) => string, testID: string}} props
 */
export const TableHeader = ({ columns, sort, onSort, sortLabel, testID }) => (
    <DataTable.Header>
        {columns.map((column) => {
            const sorted = sort?.key === column.key ? sort.direction : undefined;
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
);

/**
 * One row of a data table: a cell per column (`render(row)`, else `row[key]`; a blank one shows an em dash),
 * pressable with `onPress`, painted `secondaryContainer` and `aria-selected` when `selected`.
 *
 * @param {{columns: import('./DataTableView').DataColumn[], row: object, selected?: boolean,
 *     onPress?: () => void, accessibilityLabel?: string, testID: string}} props
 */
export const TableRow = ({ columns, row, selected = false, onPress, accessibilityLabel, testID }) => {
    const { colors } = useTheme();
    return (
        <DataTable.Row
            onPress={onPress}
            style={selected ? { backgroundColor: colors.secondaryContainer } : undefined}
            aria-selected={selected}
            aria-label={accessibilityLabel}
            testID={testID}
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
};
