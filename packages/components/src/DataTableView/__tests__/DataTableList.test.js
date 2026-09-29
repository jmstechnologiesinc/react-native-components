jest.mock('react-native-localize', () => ({
    findBestLanguageTag: jest.fn(() => ({ languageTag: 'en', isRTL: false })),
}));

import React from 'react';
import { FlatList } from 'react-native';
import renderer, { act } from 'react-test-renderer';

import { DataTable, MD3LightTheme, Provider } from '@jmstechnologiesinc/react-native-paper';

import { setI18nConfig } from '../../Localization/Localization';
import DataTableList from '../DataTableList';

// The virtualized table: a Paper table on a FlatList that asks the host for the next page near its end.

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

const hostOf = (tree, testID) =>
    tree.root.findAll((node) => typeof node.type === 'string' && node.props.testID === testID)[0];
const pressableOf = (tree, testID) =>
    tree.root.findAll((node) => node.props.testID === testID && typeof node.props.onPress === 'function')[0];
const listOf = (tree) => tree.root.findByType(FlatList);
const hasText = (tree, text) => tree.root.findAll((node) => node.props.children === text).length > 0;

const COLUMNS = [
    { key: 'name', title: 'Name', sortable: true },
    { key: 'count', title: 'Count', numeric: true },
];
const ROWS = [
    { id: 'a', name: 'Charlie', count: 2 },
    { id: 'b', name: 'alpha', count: 10 },
];

const table = (props) => (
    <DataTableList columns={COLUMNS} rows={ROWS} rowKey="id" accessibilityLabel="People" testID="t" {...props} />
);

describe('DataTableList', () => {
    it('is a Paper DataTable named by accessibilityLabel, its header and its rows on a FlatList', () => {
        const tree = render(table());
        expect(tree.root.findByType(DataTable).props['aria-label']).toBe('People');
        expect(hostOf(tree, 't-title-name')).toBeTruthy();
        expect(hostOf(tree, 't-row-a')).toBeTruthy();
        expect(hostOf(tree, 't-row-b')).toBeTruthy();
        expect(listOf(tree).props.stickyHeaderIndices).toEqual([0]);
    });

    it('places rows at a fixed height without measuring them (the MD3 48dp row)', () => {
        const tree = render(table());
        expect(listOf(tree).props.getItemLayout(ROWS, 3)).toEqual({
            length: MD3LightTheme.spacing.x12,
            offset: MD3LightTheme.spacing.x12 * 3,
            index: 3,
        });
    });

    it('asks for the next page near the end only while more can load, and not while one loads', () => {
        const onLoadMore = jest.fn();
        const tree = render(table({ hasMore: true, onLoadMore }));
        act(() => listOf(tree).props.onEndReached({ distanceFromEnd: 0 }));
        expect(onLoadMore).toHaveBeenCalledTimes(1);

        act(() =>
            tree.update(
                <Provider theme={MD3LightTheme}>{table({ hasMore: true, loadingMore: true, onLoadMore })}</Provider>
            )
        );
        act(() => listOf(tree).props.onEndReached({ distanceFromEnd: 0 }));
        expect(onLoadMore).toHaveBeenCalledTimes(1);
        expect(hostOf(tree, 't-loading-more')).toBeTruthy();

        act(() => tree.update(<Provider theme={MD3LightTheme}>{table({ hasMore: false, onLoadMore })}</Provider>));
        act(() => listOf(tree).props.onEndReached({ distanceFromEnd: 0 }));
        expect(onLoadMore).toHaveBeenCalledTimes(1);
    });

    it('after a failed page it waits for Retry, which asks again', () => {
        const onLoadMore = jest.fn();
        const tree = render(table({ hasMore: true, loadMoreFailed: true, onLoadMore, loadMoreFailedLabel: 'No more' }));
        act(() => listOf(tree).props.onEndReached({ distanceFromEnd: 0 }));
        expect(onLoadMore).not.toHaveBeenCalled();
        expect(hasText(tree, 'No more')).toBe(true);

        act(() => pressableOf(tree, 't-retry').props.onPress());
        expect(onLoadMore).toHaveBeenCalledTimes(1);
    });

    it('names a pressable row and marks the selected one', () => {
        const onRowPress = jest.fn();
        const tree = render(
            table({ onRowPress, rowAccessibilityLabel: (row) => `Open ${row.name}`, selectedKey: 'b' })
        );
        const row = tree.root.findAll((node) => node.type === DataTable.Row && node.props.testID === 't-row-a')[0];
        expect(row.props['aria-label']).toBe('Open Charlie');
        act(() => row.props.onPress());
        expect(onRowPress).toHaveBeenCalledWith(ROWS[0]);
        const selected = tree.root.findAll((node) => node.type === DataTable.Row && node.props.testID === 't-row-b')[0];
        expect(selected.props['aria-selected']).toBe(true);
    });

    it('shows the empty label without rows', () => {
        const tree = render(table({ rows: [], emptyLabel: 'Nobody' }));
        expect(hostOf(tree, 't-empty')).toBeTruthy();
    });
});
