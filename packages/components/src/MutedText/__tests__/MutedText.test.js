jest.mock('react-native-localize', () => ({
    findBestLanguageTag: jest.fn(() => ({ languageTag: 'en', isRTL: false })),
}));

import React from 'react';
import renderer, { act } from 'react-test-renderer';

import { MD3LightTheme, Provider } from '@jmstechnologiesinc/react-native-paper';

import { setI18nConfig } from '../../Localization/Localization';
import MutedText from '../MutedText';

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

describe('MutedText', () => {
    it('paints its text onSurfaceVariant in the variant asked', () => {
        const tree = render(
            <MutedText variant="bodySmall" testID="muted">
                No open tasks
            </MutedText>
        );
        const text = hostOf(tree, 'muted');
        expect(JSON.stringify(text.props.style)).toContain(MD3LightTheme.colors.onSurfaceVariant);
        expect(textOf(tree)).toContain('No open tasks');
    });
});
