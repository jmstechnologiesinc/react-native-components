jest.mock('react-native-localize', () => ({
    findBestLanguageTag: jest.fn(() => ({ languageTag: 'en', isRTL: false })),
}));

import React from 'react';
import renderer, { act } from 'react-test-renderer';

import { MD3LightTheme, Provider } from '@jmstechnologiesinc/react-native-paper';

import { setI18nConfig } from '../../Localization/Localization';
import CodeBlock, { codeText } from '../CodeBlock';

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

describe('CodeBlock', () => {
    it('shows strings as given and anything else as indented JSON', () => {
        expect(codeText('a && b')).toBe('a && b');
        expect(codeText({ a: 1 })).toBe('{\n  "a": 1\n}');
        expect(codeText(undefined)).toBe('');
    });

    it('is selectable monospace text on a surfaceVariant well, a named group when labelled', () => {
        const tree = render(<CodeBlock value={{ ok: true }} accessibilityLabel="Result" />);
        const text = hostOf(tree, 'code-block');
        expect(text.props.selectable).toBe(true);
        expect(JSON.stringify(text.props.style)).toContain('fontFamily');
        const container = hostOf(tree, 'code-block-container');
        expect(container.props.role).toBe('group');
        expect(container.props['aria-label']).toBe('Result');
    });
});
