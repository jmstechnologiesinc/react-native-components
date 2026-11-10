import React from 'react';
import { Dimensions, Text } from 'react-native';
import renderer, { act } from 'react-test-renderer';

import { MD3LightTheme, Provider } from '@jmstechnologiesinc/react-native-paper';

import Feed, { feedColumns } from '../Feed';
import { paneMetrics } from '../metrics';

// MD3's feed: as many columns as fit at least a fixed pane wide, each item as wide as its column.

const INITIAL_WINDOW = Dimensions.get('window');
const METRICS = paneMetrics(MD3LightTheme);
// The theme's tokens are scaled under jest (size-matters on the default window): widths are taken from the theme.
const GAP = MD3LightTheme.spacing.x4;
const TWO_COLUMNS = 2 * METRICS.fixedPane + GAP;

const setWindow = (width) =>
    act(() => {
        Dimensions.set({ window: { ...INITIAL_WINDOW, width, height: 1000 } });
    });

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
    });
    act(() => {
        Dimensions.set({ window: INITIAL_WINDOW });
    });
});

const hostOf = (tree, testID) =>
    tree.root.findAll((node) => typeof node.type === 'string' && node.props.testID === testID)[0];

const flatStyle = (node) => Object.assign({}, ...[node.props.style].flat(Infinity).filter(Boolean));

const measure = (tree, width) => act(() => hostOf(tree, 'feed').props.onLayout({ nativeEvent: { layout: { width } } }));

const feed = () => (
    <Feed>
        <Text key="ride">Ride</Text>
        <Text key="delivery">Delivery</Text>
        {null}
        <Text key="driver">Driver</Text>
    </Feed>
);

describe('feedColumns', () => {
    it('is one column until two fit at least a fixed pane wide each, with the gap between them', () => {
        expect(feedColumns(TWO_COLUMNS - 1, METRICS, GAP).columns).toBe(1);
        expect(feedColumns(TWO_COLUMNS, METRICS, GAP).columns).toBe(2);
        expect(feedColumns(3 * METRICS.fixedPane + 2 * GAP, METRICS, GAP).columns).toBe(3);
    });

    it('is never fewer than one column, however narrow the width', () => {
        expect(feedColumns(100, METRICS, GAP)).toEqual({ columns: 1, itemWidth: 100 });
    });

    it('shares the width between the columns in whole dp, so a row never wraps by a fraction', () => {
        const width = TWO_COLUMNS + 101;
        const { itemWidth } = feedColumns(width, METRICS, GAP);
        expect(itemWidth).toBe(Math.floor((width - GAP) / 2));
        expect(2 * itemWidth + GAP).toBeLessThanOrEqual(width);
    });
});

describe('Feed', () => {
    it('lays its items out in a wrapping row, each as wide as its column, the gap between them both ways', () => {
        const tree = render(feed());
        measure(tree, TWO_COLUMNS + 100);
        expect(flatStyle(hostOf(tree, 'feed'))).toEqual(
            expect.objectContaining({ flexDirection: 'row', flexWrap: 'wrap', gap: GAP })
        );
        const itemWidth = Math.floor((TWO_COLUMNS + 100 - GAP) / 2);
        // An empty child is not an item.
        expect(['feed-item-0', 'feed-item-1', 'feed-item-2'].map((id) => flatStyle(hostOf(tree, id)).width)).toEqual([
            itemWidth,
            itemWidth,
            itemWidth,
        ]);
        expect(hostOf(tree, 'feed-item-3')).toBeUndefined();
    });

    it('is a single column as wide as itself on a phone', () => {
        const tree = render(feed());
        measure(tree, 358);
        expect(flatStyle(hostOf(tree, 'feed-item-0')).width).toBe(358);
    });

    it("until it is measured, takes its columns from the window's width, and follows a resized window", () => {
        setWindow(TWO_COLUMNS);
        const tree = render(feed());
        expect(flatStyle(hostOf(tree, 'feed-item-0')).width).toBe(Math.floor((TWO_COLUMNS - GAP) / 2));
        setWindow(TWO_COLUMNS - 1);
        expect(flatStyle(hostOf(tree, 'feed-item-0')).width).toBe(Math.floor(TWO_COLUMNS - 1));
    });
});
