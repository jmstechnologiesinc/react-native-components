import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { DataTable, useTheme } from '@jmstechnologiesinc/react-native-paper';

import { EMPTY_VALUE } from '../valueText';

export const isBlank = (value) => value === undefined || value === null || value === '';

/**
 * A column's box: its `flex`, and — for a numeric column that another column follows — a trailing inset of
 * `spacing.x4`. Paper sets no space between cells, so a right-aligned number (and its title) would otherwise touch the
 * left-aligned text of the next column (MD3 data tables keep a gutter between columns).
 */
const columnStyle = (column, isLast, spacing) => [
    column.flex ? { flex: column.flex } : null,
    column.numeric && !isLast ? { paddingEnd: spacing.x4 } : null,
];

/**
 * The header row of a data table: one `DataTable.Title` per column; a sortable one is a button named
 * `sortLabel(title)` and says its direction (`aria-sort`).
 *
 * @param {{columns: import('./DataTableView').DataColumn[], sort?: ?import('./DataTableView').DataSort,
 *     onSort: (key: string) => void, sortLabel: (title: string) => string, testID: string}} props
 */
export const TableHeader = ({ columns, sort, onSort, sortLabel, testID }) => {
    const { spacing } = useTheme();
    return (
        <DataTable.Header>
            {columns.map((column, index) => {
                const sorted = sort?.key === column.key ? sort.direction : undefined;
                return (
                    <DataTable.Title
                        key={column.key}
                        numeric={column.numeric}
                        sortDirection={column.sortable ? sorted : undefined}
                        onPress={column.sortable ? () => onSort(column.key) : undefined}
                        style={columnStyle(column, index === columns.length - 1, spacing)}
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
};

/**
 * One cell: text goes through Paper's `DataTable.Cell`, which sets it in one line; an element (a chip, a
 * link) goes in a `View` laid out like Paper's cell — Paper's cell wraps its children in a `Text`, and a
 * view inside a text breaks the layout on the web (Paper's own note: use a View for anything but text).
 * The element sits in a box of its own, centred on the row like Paper's text: the chip family sets
 * `alignSelf: flex-start` (so a chip never stretches down a column), which, as a direct child of the
 * cell's row, would pin it to the top of the 48dp row instead.
 */
const Cell = ({ column, content, isLast }) => {
    const { spacing } = useTheme();
    const style = columnStyle(column, isLast, spacing);
    if (React.isValidElement(content)) {
        return (
            <View
                {...(Platform.OS === 'web' ? { role: 'cell' } : {})}
                style={[styles.cell, column.numeric && styles.numeric, ...style]}
            >
                <View style={styles.element}>{content}</View>
            </View>
        );
    }
    return (
        <DataTable.Cell numeric={column.numeric} style={style}>
            {isBlank(content) ? EMPTY_VALUE : content}
        </DataTable.Cell>
    );
};

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
            {columns.map((column, index) => (
                <Cell
                    key={column.key}
                    column={column}
                    content={column.render ? column.render(row) : row[column.key]}
                    isLast={index === columns.length - 1}
                />
            ))}
        </DataTable.Row>
    );
};

// Paper's cell geometry (`DataTableCell`): a flexible row, centred vertically; a numeric one ends at the trailing edge.
const styles = StyleSheet.create({
    cell: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    numeric: {
        justifyContent: 'flex-end',
    },
    // A box the size of its element (never the cell's width), so a numeric cell still ends at the trailing edge.
    element: {
        flexShrink: 1,
    },
});
