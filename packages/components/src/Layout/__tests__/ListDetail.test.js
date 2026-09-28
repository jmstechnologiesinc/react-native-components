jest.mock('react-native-localize', () => ({
    findBestLanguageTag: jest.fn(() => ({ languageTag: 'en', isRTL: false })),
}));

import React from 'react';
import { Dimensions, Text } from 'react-native';
import renderer, { act } from 'react-test-renderer';

import { MD3LightTheme, Provider } from '@jmstechnologiesinc/react-native-paper';

import { setI18nConfig } from '../../Localization/Localization';
import ListDetail, { fitsListDetail } from '../ListDetail';
import { paneMetrics } from '../metrics';

// List-detail inside a pane: two columns when the measured width fits both, else one at a time with a back row.

jest.useFakeTimers();

const INITIAL_WINDOW = Dimensions.get('window');
const METRICS = paneMetrics(MD3LightTheme);
// The theme's tokens are scaled under jest (size-matters on the default window): widths are taken from the metrics.
const FITS = METRICS.fixedPane * 2 + METRICS.spacer;

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
        jest.runOnlyPendingTimers();
    });
    act(() => {
        Dimensions.set({ window: INITIAL_WINDOW });
    });
});

beforeAll(() => setI18nConfig());

const hostOf = (tree, testID) =>
    tree.root.findAll((node) => typeof node.type === 'string' && node.props.testID === testID)[0];

const measure = (tree, width) =>
    act(() => hostOf(tree, 'list-detail').props.onLayout({ nativeEvent: { layout: { width } } }));

const flatStyle = (node) => Object.assign({}, ...[node.props.style].flat(Infinity).filter(Boolean));

const block = (props) => (
    <ListDetail
        list={<Text>the list</Text>}
        detail={<Text>the detail</Text>}
        listLabel="Documents"
        detailLabel="Review"
        onBack={() => {}}
        {...props}
    />
);

describe('fitsListDetail', () => {
    it('fits when the detail column is at least as wide as the fixed list', () => {
        const exact = METRICS.fixedPane * 2 + METRICS.spacer;
        expect(fitsListDetail(exact, METRICS)).toBe(true);
        expect(fitsListDetail(exact - 1, METRICS)).toBe(false);
    });
});

describe('ListDetail', () => {
    it('lays the list beside the detail when its measured width fits both, the list at the fixed pane width', () => {
        const tree = render(block());
        measure(tree, FITS + 10);

        expect(hostOf(tree, 'list-detail-list')).toBeTruthy();
        expect(hostOf(tree, 'list-detail-detail')).toBeTruthy();
        expect(flatStyle(hostOf(tree, 'list-detail-list')).width).toBe(METRICS.fixedPane);
        expect(flatStyle(hostOf(tree, 'list-detail')).flexDirection).toBe('row');
        expect(hostOf(tree, 'list-detail-back')).toBeUndefined();
    });

    it('shows one column at a time when the width does not fit: the list, then the detail with a back row', () => {
        const onBack = jest.fn();
        const tree = render(block({ onBack }));
        measure(tree, FITS - 1);
        expect(hostOf(tree, 'list-detail-list')).toBeTruthy();
        expect(hostOf(tree, 'list-detail-detail')).toBeUndefined();

        act(() => tree.update(<Provider theme={MD3LightTheme}>{block({ onBack, showDetail: true })}</Provider>));
        expect(hostOf(tree, 'list-detail-list')).toBeUndefined();
        expect(hostOf(tree, 'list-detail-detail')).toBeTruthy();
        const back = tree.root.findAll((node) => node.props.testID === 'list-detail-back' && node.props.onPress)[0];
        expect(back.props.accessibilityLabel).toBe('Back to Documents');
        act(() => back.props.onPress());
        expect(onBack).toHaveBeenCalledTimes(1);
    });

    it('decides from the window size class until it is measured', () => {
        setWindow(500);
        const compact = render(block());
        expect(hostOf(compact, 'list-detail-detail')).toBeUndefined();

        setWindow(1400);
        const wide = render(block());
        expect(hostOf(wide, 'list-detail-detail')).toBeTruthy();
    });

    it('names its columns as regions', () => {
        const tree = render(block());
        measure(tree, FITS + 10);
        expect(hostOf(tree, 'list-detail-list').props['aria-label']).toBe('Documents');
        expect(hostOf(tree, 'list-detail-detail').props['aria-label']).toBe('Review');
    });
});
