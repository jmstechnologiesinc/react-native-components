jest.mock('react-native-localize', () => ({
    findBestLanguageTag: jest.fn(() => ({ languageTag: 'en', isRTL: false })),
}));

import React from 'react';
import { StyleSheet } from 'react-native';
import renderer, { act } from 'react-test-renderer';

import { MD3LightTheme, Provider } from '@jmstechnologiesinc/react-native-paper';

import { setI18nConfig } from '../../Localization/Localization';
import * as Tabs from '../Tabs';

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

const TABS = [
    { value: 'summary', label: 'Summary' },
    { value: 'documents', label: 'Documents' },
    { value: 'history', label: 'History', disabled: true },
];

describe('Tabs.Bar', () => {
    it('is a named tablist of primary tabs with the current one selected', () => {
        const tree = render(
            <Tabs.Bar tabs={TABS} value="documents" onChange={() => {}} accessibilityLabel="Sections" />
        );
        const list = hostOf(tree, 'tabs');
        expect(list.props.accessibilityRole).toBe('tablist');
        expect(list.props.accessibilityLabel).toBe('Sections');
        const items = tree.root.findAllByType(Tabs.Item);
        expect(items.map((item) => item.props.variant)).toEqual(['primary', 'primary', 'primary']);
        expect(items.map((item) => item.props.isSelected)).toEqual([false, true, false]);
        expect(items.map((item) => item.props.testID)).toEqual(['tabs-summary', 'tabs-documents', 'tabs-history']);
        expect(items[2].props.disabled).toBe(true);
    });

    it('reports the value of the tab pressed', () => {
        const onChange = jest.fn();
        const tree = render(<Tabs.Bar tabs={TABS} value="summary" onChange={onChange} />);
        act(() => tree.root.findAllByType(Tabs.Item)[1].props.onPress());
        expect(onChange).toHaveBeenCalledWith('documents');
    });

    it('is as wide as its container and never grows along a column', () => {
        const tree = render(<Tabs.Bar tabs={TABS} value="summary" onChange={() => {}} />);
        const bar = tree.root.findByType(Tabs.Scrollable);
        const style = StyleSheet.flatten(bar.props.style);
        expect(style.width).toBe('100%');
        expect(style.flexGrow).toBe(0);
    });
});
