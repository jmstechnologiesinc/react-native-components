jest.mock('react-native-localize', () => ({
    findBestLanguageTag: jest.fn(() => ({ languageTag: 'en', isRTL: false })),
}));

import React from 'react';
import renderer, { act } from 'react-test-renderer';

import { MD3LightTheme, Provider, TextInput } from '@jmstechnologiesinc/react-native-paper';

import FormField from '../FormField';
import SecretInputText from '../SecretInputText';

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

const SECRET = '123456789';

const nativeInput = (tree) => tree.root.findAll((node) => node.type === 'TextInput' && node.props.value === SECRET)[0];

const toggles = (tree) => tree.root.findAllByType(TextInput.Icon);

// Alta y consola plan 2.7: the «show» toggle is an entry aid, offered only while the secret can be typed.
describe('SecretInputText', () => {
    it('offers the «show» toggle while editable, and it reveals the secret', () => {
        const tree = render(<SecretInputText mode="outlined" label="SSN" value={SECRET} onChangeText={() => {}} />);
        expect(nativeInput(tree).props.secureTextEntry).toBe(true);
        expect(toggles(tree)).toHaveLength(1);
        act(() => toggles(tree)[0].props.onPress());
        expect(nativeInput(tree).props.secureTextEntry).toBe(false);
    });

    it('offers none when disabled, as before', () => {
        const tree = render(<SecretInputText mode="outlined" label="SSN" value={SECRET} disabled />);
        expect(toggles(tree)).toHaveLength(0);
        expect(nativeInput(tree).props.secureTextEntry).toBe(true);
    });

    it('offers none on a read-only field: the secret stays masked and is not disabled', () => {
        const tree = render(
            <FormField input={SecretInputText} mode="outlined" label="SSN" value={SECRET} readOnly highlighted />
        );
        expect(toggles(tree)).toHaveLength(0);
        expect(nativeInput(tree).props).toMatchObject({ secureTextEntry: true, editable: false });
        expect(tree.root.findAllByType(SecretInputText)[0].props.disabled).toBeUndefined();
    });
});
