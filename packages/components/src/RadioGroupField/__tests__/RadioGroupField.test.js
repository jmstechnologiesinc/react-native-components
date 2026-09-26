jest.mock('react-native-localize', () => ({
    findBestLanguageTag: jest.fn(() => ({ languageTag: 'en', isRTL: false })),
}));

import React from 'react';
import renderer, { act } from 'react-test-renderer';

import { MD3LightTheme, Provider, RadioButton } from '@jmstechnologiesinc/react-native-paper';

import { setI18nConfig } from '../../Localization/Localization';
import RadioGroupField from '../RadioGroupField';

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

const textOf = (tree) => JSON.stringify(tree.toJSON());

const OPTIONS = [
    { value: 'one', label: 'First' },
    { value: 'two', label: 'Second', disabled: true },
];

describe('RadioGroupField', () => {
    it('is a named radiogroup of Paper RadioButton.Items that reports the chosen value', () => {
        const onChange = jest.fn();
        const tree = render(<RadioGroupField label="Trip class" options={OPTIONS} value="one" onChange={onChange} />);
        const group = hostOf(tree, 'radio-group');
        expect(group.props.role).toBe('radiogroup');
        expect(group.props['aria-label']).toBe('Trip class');
        const items = tree.root.findAllByType(RadioButton.Item);
        expect(items.map((item) => item.props.label)).toEqual(['First', 'Second']);
        expect(items.map((item) => item.props.disabled)).toEqual([false, true]);
        expect(tree.root.findByType(RadioButton.Group).props.value).toBe('one');

        act(() => tree.root.findByType(RadioButton.Group).props.onValueChange('two'));
        expect(onChange).toHaveBeenCalledWith('two');
    });

    it('disables every option and shows its error', () => {
        const tree = render(
            <RadioGroupField options={OPTIONS} onChange={() => {}} disabled error="Choose one" testID="reason" />
        );
        expect(tree.root.findAllByType(RadioButton.Item).every((item) => item.props.disabled)).toBe(true);
        expect(hostOf(tree, 'reason-error')).toBeDefined();
        expect(textOf(tree)).toContain('Choose one');
    });
});
