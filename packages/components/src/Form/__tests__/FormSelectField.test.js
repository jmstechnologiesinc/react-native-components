jest.mock('react-native-localize', () => ({
    findBestLanguageTag: jest.fn(() => ({ languageTag: 'en', isRTL: false })),
}));

import React from 'react';
import renderer, { act } from 'react-test-renderer';

import { MD3LightTheme, Menu, Provider, TextInput } from '@jmstechnologiesinc/react-native-paper';

import { setI18nConfig } from '../../Localization/Localization';
import FormSelectField from '../FormSelectField';
import { drawnInput } from './__fixtures__/drawnInput';

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

const { colors } = MD3LightTheme;

const COLORS = [
    { value: 'SIL', label: 'Silver' },
    { value: 'BLK', label: 'Black' },
];

const select = (props) =>
    render(
        <FormSelectField label="Color" value="SIL" options={COLORS} onSelect={() => {}} testID="color" {...props} />
    );

const buttons = (tree) =>
    tree.root.findAll((node) => typeof node.type === 'string' && node.props.accessibilityRole === 'button');

const dropdownIcons = (tree) => tree.root.findAllByType(TextInput.Icon);

// Alta y consola plan 2.6: a read-only pick is shown as a read-only field — no menu, no dropdown, enabled colours.
describe('FormSelectField', () => {
    it('opens its menu from a button with a dropdown icon while editable, and reports the pick', () => {
        const onSelect = jest.fn();
        const tree = select({ onSelect });
        expect(dropdownIcons(tree)).toHaveLength(1);
        expect(buttons(tree).map((node) => node.props.testID)).toContain('color');
        act(() => tree.root.find((node) => node.props.testID === 'color' && node.props.onPress).props.onPress());
        act(() => tree.root.find((node) => node.props.testID === 'color.BLK').props.onPress());
        expect(onSelect).toHaveBeenCalledWith(COLORS[1]);
    });

    it('stays a disabled button with no dropdown when disabled, as before', () => {
        const tree = select({ disabled: true });
        expect(dropdownIcons(tree)).toHaveLength(0);
        expect(buttons(tree)[0].props.accessibilityState).toMatchObject({ disabled: true });
        expect(drawnInput(tree, 'Silver').textColor).toBe(colors.onSurfaceDisabled);
    });

    it('under readOnly: the label in a read-only field, no menu, no dropdown, no button, enabled colours', () => {
        const tree = select({ readOnly: true, highlighted: true });
        expect(tree.root.findAllByType(Menu)).toHaveLength(0);
        expect(dropdownIcons(tree)).toHaveLength(0);
        expect(buttons(tree)).toHaveLength(0);
        const drawn = drawnInput(tree, 'Silver');
        expect(drawn).toMatchObject({ editable: false, textColor: colors.onSurface, outlineColor: colors.primary });
        expect(JSON.stringify(tree.toJSON())).toContain('"Changed"');
        // The testID names the field the reader meets: the input itself.
        const input = tree.root.find((node) => node.type === 'TextInput' && node.props.value === 'Silver');
        expect(input.props.testID).toBe('color');
    });

    it('under readOnly shows a stored value the options no longer list by its name', () => {
        const tree = select({ readOnly: true, value: 'dx:retired', displayValue: 'Champagne' });
        expect(drawnInput(tree, 'Champagne').editable).toBe(false);
    });
});
