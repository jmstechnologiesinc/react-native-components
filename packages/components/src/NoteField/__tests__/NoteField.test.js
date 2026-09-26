jest.mock('react-native-localize', () => ({
    findBestLanguageTag: jest.fn(() => ({ languageTag: 'en', isRTL: false })),
}));

import React from 'react';
import { Platform } from 'react-native';
import renderer, { act } from 'react-test-renderer';

import { HelperText, MD3LightTheme, Provider, TextInput } from '@jmstechnologiesinc/react-native-paper';

import { setI18nConfig } from '../../Localization/Localization';
import NoteField from '../NoteField';

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

const textOf = (tree) => JSON.stringify(tree.toJSON());

describe('NoteField', () => {
    it('is an outlined multi-line input with the error it is given under it', () => {
        const tree = render(
            <NoteField label="Note" value="" onChangeText={() => {}} required error="A note is required" />
        );
        const input = tree.root.findByType(TextInput);
        expect(input.props.mode).toBe('outlined');
        expect(input.props.multiline).toBe(true);
        expect(input.props.numberOfLines).toBe(3);
        expect(input.props.label).toBe('Note *');
        expect(input.props.error).toBe(true);
        expect(input.props.accessibilityLabel).toBe('Note');
        const helper = tree.root.findByType(HelperText);
        expect(helper.props.type).toBe('error');
        expect(helper.props.visible).toBe(true);
        expect(textOf(tree)).toContain('A note is required');
    });

    it('shows the helper while there is no error and reports the text typed', () => {
        const onChangeText = jest.fn();
        const tree = render(
            <NoteField label="Reason" value="x" onChangeText={onChangeText} helper="Seen by the partner" />
        );
        expect(tree.root.findByType(HelperText).props.type).toBe('info');
        expect(textOf(tree)).toContain('Seen by the partner');
        act(() => tree.root.findByType(TextInput).props.onChangeText('xy'));
        expect(onChangeText).toHaveBeenCalledWith('xy');
    });

    it('marks the input aria-required on the web only', () => {
        const native = render(<NoteField label="Note" value="" onChangeText={() => {}} required />);
        expect(native.root.findByType(TextInput).props['aria-required']).toBeUndefined();

        jest.replaceProperty(Platform, 'OS', 'web');
        const web = render(<NoteField label="Note" value="" onChangeText={() => {}} required />);
        expect(web.root.findByType(TextInput).props['aria-required']).toBe(true);
        jest.restoreAllMocks();
    });
});
