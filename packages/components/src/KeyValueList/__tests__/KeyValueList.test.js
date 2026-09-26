jest.mock('react-native-localize', () => ({
    findBestLanguageTag: jest.fn(() => ({ languageTag: 'en', isRTL: false })),
}));

import React from 'react';
import { Text } from 'react-native';
import renderer, { act } from 'react-test-renderer';

import { MD3LightTheme, Provider } from '@jmstechnologiesinc/react-native-paper';

import { setI18nConfig } from '../../Localization/Localization';
import KeyValueList from '../KeyValueList';

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

describe('KeyValueList', () => {
    it('is a list of label/value rows, an em dash for a missing value, a node as given', () => {
        const tree = render(
            <KeyValueList
                testID="kv"
                items={[
                    { key: 'queue', label: 'Queue', value: 'Documents' },
                    { key: 'count', label: 'Count', value: 0 },
                    { key: 'assignee', label: 'Assignee', value: null },
                    { key: 'status', label: 'Status', value: <Text testID="chip">Open</Text> },
                ]}
            />
        );
        expect(hostOf(tree, 'kv').props.role).toBe('list');
        expect(hostOf(tree, 'kv-queue').props.role).toBe('listitem');
        const json = textOf(tree);
        expect(json).toContain('Documents');
        expect(json).toContain('"0"');
        expect(json).toContain('—');
        expect(hostOf(tree, 'chip')).toBeDefined();
    });
});
