jest.mock('react-native-localize', () => ({
    findBestLanguageTag: jest.fn(() => ({ languageTag: 'en', isRTL: false })),
}));

import React from 'react';
import renderer, { act } from 'react-test-renderer';

import { Chip, MD3LightTheme, Menu, Provider } from '@jmstechnologiesinc/react-native-paper';

import { setI18nConfig } from '../../Localization/Localization';
import MenuFilterChip from '../MenuFilterChip';

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

const STATUSES = [
    { value: 'onboarding', label: 'Onboarding' },
    { value: 'active', label: 'Active' },
];

const chipOf = (tree) => tree.root.findByType(Chip);
const isOpen = (tree) => tree.root.findByType(Menu).props.visible;
const itemsOf = (tree) => React.Children.toArray(tree.root.findByType(Menu).props.children);
const open = (tree) => act(() => chipOf(tree).props.onPress());

describe('MenuFilterChip', () => {
    it('unfiltered: an outlined chip naming the dimension, with a trailing arrow (as ChipList draws one)', () => {
        const tree = render(<MenuFilterChip label="Status" options={STATUSES} onChange={() => {}} />);
        const chip = chipOf(tree);
        expect(chip.props.mode).toBe('outlined');
        expect(chip.props.selected).toBe(false);
        expect(chip.props.showSelectedOverlay).toBe(true);
        expect(chip.props.style).toBeUndefined();
        expect(chip.props.children).toBe('Status');
        expect(chip.props.closeIcon).toBe('menu-down');
        expect(chip.props.closeIconAccessibilityLabel).toBe('Choose Status');
    });

    it('filtered: the same outlined chip, selected, reading the active filter', () => {
        const tree = render(<MenuFilterChip label="Status" options={STATUSES} value="active" onChange={() => {}} />);
        const chip = chipOf(tree);
        expect(chip.props.mode).toBe('outlined');
        expect(chip.props.selected).toBe(true);
        expect(chip.props.children).toBe('Status: Active');
        expect(chip.props.accessibilityState).toMatchObject({ selected: true, expanded: false });
    });

    it('opens from the chip and from its trailing arrow', () => {
        const tree = render(<MenuFilterChip label="Status" options={STATUSES} onChange={() => {}} />);
        expect(isOpen(tree)).toBe(false);
        open(tree);
        expect(isOpen(tree)).toBe(true);

        const other = render(<MenuFilterChip label="Status" options={STATUSES} onChange={() => {}} />);
        act(() => chipOf(other).props.onClose());
        expect(isOpen(other)).toBe(true);
    });

    it('reports the chosen value and closes; choosing the current one reports nothing', () => {
        const onChange = jest.fn();
        const tree = render(<MenuFilterChip label="Status" options={STATUSES} value="active" onChange={onChange} />);
        open(tree);
        const [onboarding, active] = itemsOf(tree);
        expect(active.props.leadingIcon).toBe('check');
        expect(onboarding.props.leadingIcon).toBeUndefined();

        act(() => active.props.onPress());
        expect(onChange).not.toHaveBeenCalled();
        expect(isOpen(tree)).toBe(false);

        open(tree);
        act(() => itemsOf(tree)[0].props.onPress());
        expect(onChange).toHaveBeenCalledWith('onboarding');
    });

    it('offers the clearing choice first, reporting null', () => {
        const onChange = jest.fn();
        const tree = render(
            <MenuFilterChip
                label="Status"
                options={STATUSES}
                value="active"
                clearLabel="Any status"
                onChange={onChange}
                testID="status"
            />
        );
        open(tree);
        const [clear] = itemsOf(tree);
        expect(clear.props).toMatchObject({ title: 'Any status', testID: 'status.clear' });
        act(() => clear.props.onPress());
        expect(onChange).toHaveBeenCalledWith(null);
    });

    it('does not open while disabled', () => {
        const tree = render(<MenuFilterChip label="Status" options={STATUSES} disabled onChange={() => {}} />);
        expect(chipOf(tree).props.onClose).toBeUndefined();
        open(tree);
        expect(isOpen(tree)).toBe(false);
    });
});
