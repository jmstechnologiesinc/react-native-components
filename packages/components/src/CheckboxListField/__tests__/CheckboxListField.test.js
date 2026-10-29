jest.mock('react-native-localize', () => ({
    findBestLanguageTag: jest.fn(() => ({ languageTag: 'en', isRTL: false })),
}));

import React from 'react';
import { StyleSheet } from 'react-native';
import renderer, { act } from 'react-test-renderer';

import { Checkbox, List, MD3LightTheme, Provider } from '@jmstechnologiesinc/react-native-paper';

import { setI18nConfig } from '../../Localization/Localization';
import ListRow from '../../ListRow/ListRow';
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

    it('shows a disabled list and its error', () => {
        const tree = render(
            <CheckboxListField options={OPTIONS} values={[]} onChange={() => {}} disabled error="Pick at least one" />
        );
        expect(tree.root.findAllByType(Checkbox.Item).every((item) => item.props.disabled)).toBe(true);
        expect(textOf(tree)).toContain('Pick at least one');
    });

    // Alta y consola plan 2.8: the choice shown, not asked — rows with a check, nothing greyed out.
    describe('readOnly', () => {
        const readOnly = (props) =>
            render(<CheckboxListField label="Items" options={OPTIONS} values={['expiry']} readOnly {...props} />);

        it('shows every option as a row in a list named by the label, no checkbox', () => {
            const tree = readOnly();
            expect(tree.root.findAllByType(Checkbox.Item)).toHaveLength(0);
            const rows = tree.root.findAllByType(ListRow);
            expect(rows.map((row) => [row.props.title, row.props.testID])).toEqual([
                ['Photo', 'checkbox-list-photo'],
                ['Expiry date', 'checkbox-list-expiry'],
                ['Name', 'checkbox-list-name'],
            ]);
            const list = tree.root.find((node) => typeof node.type === 'string' && node.props.role === 'list');
            expect(list.props['aria-label']).toBe('Items');
            expect(hostOf(tree, 'checkbox-list').props.role).toBe('group');
        });

        it('checks the chosen options and announces them as selected', () => {
            const rows = readOnly({ values: ['expiry', 'name'] }).root.findAllByType(ListRow);
            expect(rows.map((row) => Boolean(row.props.trailing))).toEqual([false, true, true]);
            expect(rows[1].findAllByType(List.Icon)[0].props.icon).toBe('check');
            expect(rows.map((row) => row.props.accessibilityLabel)).toEqual([
                undefined,
                'Expiry date, selected',
                'Name, selected',
            ]);
        });

        it('offers nothing to press and greys nothing out, even an option the app disables', () => {
            const tree = readOnly({ options: [...OPTIONS, { value: 'other', label: 'Other', disabled: true }] });
            const rows = tree.root.findAllByType(ListRow);
            expect(rows.every((row) => row.props.onPress === undefined)).toBe(true);
            // Each title is drawn in the enabled `onSurface`, never in `onSurfaceDisabled`.
            const titleColor = (label) =>
                StyleSheet.flatten(
                    tree.root.find((node) => node.type === 'Text' && node.props.children === label).props.style
                ).color;
            expect(['Photo', 'Expiry date', 'Name', 'Other'].map(titleColor)).toEqual(
                Array(4).fill(MD3LightTheme.colors.onSurface)
            );
        });

        it('keeps its error line', () => {
            expect(textOf(readOnly({ error: 'Pick at least one' }))).toContain('Pick at least one');
        });

        it('is the disabled list when disabled as well', () => {
            const tree = readOnly({ disabled: true });
            expect(tree.root.findAllByType(ListRow)).toHaveLength(0);
            expect(tree.root.findAllByType(Checkbox.Item).every((item) => item.props.disabled)).toBe(true);
        });
    });
});
