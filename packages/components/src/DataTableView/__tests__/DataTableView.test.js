jest.mock('react-native-localize', () => ({
    findBestLanguageTag: jest.fn(() => ({ languageTag: 'en', isRTL: false })),
}));

import React from 'react';
import { StyleSheet } from 'react-native';
import renderer, { act } from 'react-test-renderer';

import { DataTable, MD3LightTheme, Provider } from '@jmstechnologiesinc/react-native-paper';

import { setI18nConfig } from '../../Localization/Localization';
import DataTableView, { SORT_DIRECTION, nextSort, sortRows } from '../DataTableView';

jest.useFakeTimers();

const mounted = [];

const render = (element) => {
    let tree;
    act(() => {
        tree = renderer.create(<Provider theme={MD3LightTheme}>{element}</Provider>);
    });
    mounted.push(tree);
    return tree;
};

afterEach(() => {
    act(() => {
        mounted.splice(0).forEach((tree) => tree.unmount());
        jest.runOnlyPendingTimers();
    });
});

beforeAll(() => setI18nConfig());

// The HOST node of a testID: what a screen reader reads.
const hostOf = (tree, testID) =>
    tree.root.findAll((node) => typeof node.type === 'string' && node.props.testID === testID)[0];

// The node that handles a press for a testID: what a user touches.
const pressableOf = (tree, testID) =>
    tree.root.findAll((node) => node.props.testID === testID && typeof node.props.onPress === 'function')[0];

const textOf = (tree) => JSON.stringify(tree.toJSON());

const COLUMNS = [
    { key: 'name', title: 'Name', sortable: true },
    { key: 'count', title: 'Count', numeric: true, sortable: true },
    { key: 'note', title: 'Note' },
];

const ROWS = [
    { id: 'a', name: 'Charlie', count: 2, note: 'x' },
    { id: 'b', name: 'alpha', count: 10 },
    { id: 'c', name: 'Bravo', count: null },
];

const table = (props) => <DataTableView columns={COLUMNS} rows={ROWS} rowKey="id" {...props} />;

const rowOrder = (tree) =>
    tree.root.findAllByType(DataTable.Row).map((row) => row.props.testID.replace('data-table-row-', ''));

const titleOf = (tree, key) => pressableOf(tree, `data-table-title-${key}`);

describe('sortRows', () => {
    it('sorts strings by locale, numbers numerically, blanks last in both directions', () => {
        const ascending = sortRows(ROWS, { key: 'count', direction: SORT_DIRECTION.ASCENDING }, COLUMNS);
        const descending = sortRows(ROWS, { key: 'count', direction: SORT_DIRECTION.DESCENDING }, COLUMNS);

        expect(ascending.map((row) => row.id)).toEqual(['a', 'b', 'c']);
        expect(descending.map((row) => row.id)).toEqual(['b', 'a', 'c']);
        expect(
            sortRows(ROWS, { key: 'name', direction: SORT_DIRECTION.ASCENDING }, COLUMNS).map((row) => row.id)
        ).toEqual(['b', 'c', 'a']);
    });

    it('leaves rows alone without a sort or for an unknown column', () => {
        expect(sortRows(ROWS, null, COLUMNS)).toBe(ROWS);
        expect(sortRows(ROWS, { key: 'nope', direction: SORT_DIRECTION.ASCENDING }, COLUMNS)).toBe(ROWS);
    });

    it('toggles ascending then descending, and starts a new column ascending', () => {
        expect(nextSort(null, 'name')).toEqual({ key: 'name', direction: 'ascending' });
        expect(nextSort({ key: 'name', direction: 'ascending' }, 'name').direction).toBe('descending');
        expect(nextSort({ key: 'name', direction: 'descending' }, 'count')).toEqual({
            key: 'count',
            direction: 'ascending',
        });
    });
});

describe('DataTableView', () => {
    it('is a named table of Paper DataTable titles, rows and cells', () => {
        const tree = render(table({ accessibilityLabel: 'Screenings' }));
        const root = hostOf(tree, 'data-table');
        expect(root.props.role).toBe('table');
        expect(root.props['aria-label']).toBe('Screenings');
        expect(tree.root.findAllByType(DataTable.Title)).toHaveLength(3);
        expect(tree.root.findAllByType(DataTable.Cell)).toHaveLength(9);
    });

    it('toggles an uncontrolled sort from the column title, named «Sort by …»', () => {
        const tree = render(table());
        expect(rowOrder(tree)).toEqual(['a', 'b', 'c']);
        expect(titleOf(tree, 'name').props.accessibilityLabel).toBe('Sort by Name');
        expect(titleOf(tree, 'name').props.accessibilityRole).toBe('button');

        act(() => titleOf(tree, 'name').props.onPress());
        expect(rowOrder(tree)).toEqual(['b', 'c', 'a']);
        expect(titleOf(tree, 'name').props.sortDirection).toBe('ascending');

        act(() => titleOf(tree, 'name').props.onPress());
        expect(rowOrder(tree)).toEqual(['a', 'c', 'b']);
    });

    it('reports the next sort and shows the rows as given when the server sorts', () => {
        const onSortChange = jest.fn();
        const tree = render(
            table({ sort: { key: 'count', direction: SORT_DIRECTION.ASCENDING }, onSortChange, sortMode: 'server' })
        );
        act(() => titleOf(tree, 'count').props.onPress());
        expect(onSortChange).toHaveBeenCalledWith({ key: 'count', direction: SORT_DIRECTION.DESCENDING });
        expect(rowOrder(tree)).toEqual(['a', 'b', 'c']);
    });

    it('does not offer sorting on a column that is not sortable; takes the host’s sort label', () => {
        const tree = render(table({ sortByLabel: (title) => `Ordenar por ${title}` }));
        expect(titleOf(tree, 'note')).toBeUndefined();
        expect(titleOf(tree, 'name').props.accessibilityLabel).toBe('Ordenar por Name');
    });

    it('renders blanks as a dash and paints and marks the selected row', () => {
        const onRowPress = jest.fn();
        const tree = render(table({ selectedKey: 'c', onRowPress }));
        const row = tree.root.findAllByType(DataTable.Row).find((node) => node.props.testID === 'data-table-row-c');
        expect(row.props['aria-selected']).toBe(true);
        expect(StyleSheet.flatten(row.props.style).backgroundColor).toBe(MD3LightTheme.colors.secondaryContainer);
        const cells = row.findAllByType(DataTable.Cell).map((cell) => cell.props.children);
        expect(cells).toEqual(['Bravo', '—', '—']);
        act(() => row.props.onPress());
        expect(onRowPress).toHaveBeenCalledWith(ROWS[2]);
    });

    it('offers Load more from the cursor state, disabled and spinning while loading', () => {
        const onLoadMore = jest.fn();
        const tree = render(table({ hasMore: true, onLoadMore }));
        expect(textOf(tree)).toContain('Load more');
        act(() => pressableOf(tree, 'data-table-load-more').props.onPress());
        expect(onLoadMore).toHaveBeenCalledTimes(1);

        const loading = render(table({ hasMore: true, loadingMore: true, onLoadMore, loadMoreLabel: 'Cargar más' }));
        const button = pressableOf(loading, 'data-table-load-more');
        expect(button.props.disabled).toBe(true);
        expect(button.props.loading).toBe(true);
        expect(textOf(loading)).toContain('Cargar más');
    });

    it('hides Load more at the end and shows the empty label without rows', () => {
        const tree = render(table({ rows: [], emptyLabel: 'No screenings' }));
        expect(pressableOf(tree, 'data-table-load-more')).toBeUndefined();
        expect(hostOf(tree, 'data-table-empty')).toBeDefined();
        expect(textOf(tree)).toContain('No screenings');
    });
});
