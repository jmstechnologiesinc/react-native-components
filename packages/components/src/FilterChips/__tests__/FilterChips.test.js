jest.mock('react-native-localize', () => ({
    findBestLanguageTag: jest.fn(() => ({ languageTag: 'en', isRTL: false })),
}));

import React from 'react';
import renderer, { act } from 'react-test-renderer';

import { Chip, MD3LightTheme, Provider } from '@jmstechnologiesinc/react-native-paper';

import { setI18nConfig } from '../../Localization/Localization';
import FilterChips from '../FilterChips';

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

const OPTIONS = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'suspended', label: 'Suspended' },
];

describe('FilterChips', () => {
    it('is a named group of outlined chips with the current value selected', () => {
        const tree = render(
            <FilterChips options={OPTIONS} value="active" onChange={() => {}} accessibilityLabel="Status" />
        );
        const group = hostOf(tree, 'filter-chips');
        expect(group.props.role).toBe('group');
        expect(group.props['aria-label']).toBe('Status');
        const chips = tree.root.findAllByType(Chip);
        expect(chips.map((chip) => chip.props.children)).toEqual(['All', 'Active', 'Suspended']);
        expect(chips.map((chip) => chip.props.selected)).toEqual([false, true, false]);
        expect(chips[0].props.mode).toBe('outlined');
    });

    it('reports the value of the chip pressed and ignores the one already selected', () => {
        const onChange = jest.fn();
        const tree = render(<FilterChips options={OPTIONS} value="all" onChange={onChange} />);
        const chips = tree.root.findAllByType(Chip);
        act(() => chips[0].props.onPress());
        act(() => chips[2].props.onPress());
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith('suspended');
    });
});
