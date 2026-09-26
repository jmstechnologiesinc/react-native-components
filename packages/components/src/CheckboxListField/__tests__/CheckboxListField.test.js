jest.mock('react-native-localize', () => ({
    findBestLanguageTag: jest.fn(() => ({ languageTag: 'en', isRTL: false })),
}));

import React from 'react';
import renderer, { act } from 'react-test-renderer';

import { Checkbox, MD3LightTheme, Provider } from '@jmstechnologiesinc/react-native-paper';

import { setI18nConfig } from '../../Localization/Localization';
import CheckboxListField from '../CheckboxListField';

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
    { value: 'photo', label: 'Photo' },
    { value: 'expiry', label: 'Expiry date' },
    { value: 'name', label: 'Name' },
];

describe('CheckboxListField', () => {
    it('is a named group of Paper Checkbox.Items with the ticked ones checked', () => {
        const tree = render(
            <CheckboxListField label="Items" options={OPTIONS} values={['expiry']} onChange={() => {}} />
        );
        const group = hostOf(tree, 'checkbox-list');
        expect(group.props.role).toBe('group');
        expect(group.props['aria-label']).toBe('Items');
        const items = tree.root.findAllByType(Checkbox.Item);
        expect(items.map((item) => item.props.status)).toEqual(['unchecked', 'checked', 'unchecked']);
        expect(items.map((item) => item.props.testID)).toEqual([
            'checkbox-list-photo',
            'checkbox-list-expiry',
            'checkbox-list-name',
        ]);
        expect(items[0].props.position).toBe('leading');
    });

    it('reports the next list: ticking appends, unticking removes', () => {
        const onChange = jest.fn();
        const tree = render(<CheckboxListField options={OPTIONS} values={['expiry']} onChange={onChange} />);
        const [photo, expiry] = tree.root.findAllByType(Checkbox.Item);
        act(() => photo.props.onPress());
        expect(onChange).toHaveBeenLastCalledWith(['expiry', 'photo']);
        act(() => expiry.props.onPress());
        expect(onChange).toHaveBeenLastCalledWith([]);
    });

    it('shows a read-only list and its error', () => {
        const tree = render(
            <CheckboxListField options={OPTIONS} values={[]} onChange={() => {}} disabled error="Pick at least one" />
        );
        expect(tree.root.findAllByType(Checkbox.Item).every((item) => item.props.disabled)).toBe(true);
        expect(textOf(tree)).toContain('Pick at least one');
    });
});
