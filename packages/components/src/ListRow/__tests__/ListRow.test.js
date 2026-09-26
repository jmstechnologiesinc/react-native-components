jest.mock('react-native-localize', () => ({
    findBestLanguageTag: jest.fn(() => ({ languageTag: 'en', isRTL: false })),
}));

import React from 'react';
import { StyleSheet, Text } from 'react-native';
import renderer, { act } from 'react-test-renderer';

import { List, MD3LightTheme, Provider } from '@jmstechnologiesinc/react-native-paper';

import { setI18nConfig } from '../../Localization/Localization';
import ListRow from '../ListRow';
import { iconSlot, nodeSlot } from '../listSlots';

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

const itemOf = (tree) => tree.root.findByType(List.Item);

describe('ListRow', () => {
    it('is always a Paper List.Item inside a listitem, pressable or not', () => {
        const still = render(<ListRow title="Read only" testID="row" />);
        expect(itemOf(still).props.onPress).toBeUndefined();
        expect(itemOf(still).props.role).toBeUndefined();
        expect(itemOf(still).props['aria-label']).toBeUndefined();
        expect(still.root.findAll((node) => node.type === 'View' && node.props.role === 'listitem')).toHaveLength(1);

        const onPress = jest.fn();
        const pressable = render(<ListRow title="Queue" onPress={onPress} testID="row" />);
        const item = itemOf(pressable);
        expect(item.props.role).toBe('button');
        expect(item.props['aria-label']).toBe('Queue');
        act(() => item.props.onPress());
        expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('announces and paints the selected row, and names it by accessibilityLabel', () => {
        const tree = render(<ListRow title="Queue" onPress={() => {}} selected accessibilityLabel="Queue, 3 tasks" />);
        const item = itemOf(tree);
        expect(item.props['aria-current']).toBe('true');
        expect(item.props['aria-label']).toBe('Queue, 3 tasks');
        expect(StyleSheet.flatten(item.props.style).backgroundColor).toBe(MD3LightTheme.colors.secondaryContainer);
    });

    it('draws details under the description, a trailing node, an icon, and children under the row', () => {
        const tree = render(
            <ListRow
                title="Driver license"
                description="Uploaded today"
                details={<Text>chips</Text>}
                trailing={<Text>trailing</Text>}
                icon="file-document-outline"
            >
                <Text>below</Text>
            </ListRow>
        );
        const item = itemOf(tree);
        expect(typeof item.props.description).toBe('function');
        expect(typeof item.props.left).toBe('function');
        const json = textOf(tree);
        for (const text of ['Driver license', 'Uploaded today', 'chips', 'trailing', 'below']) {
            expect(json).toContain(text);
        }
    });

    it('lines up with a card (inset false) and takes the rounded destination shape', () => {
        const flush = StyleSheet.flatten(itemOf(render(<ListRow title="A" inset={false} />)).props.style);
        expect(flush.paddingHorizontal).toBe(0);
        const rounded = StyleSheet.flatten(itemOf(render(<ListRow title="B" rounded />)).props.style);
        expect(rounded.marginHorizontal).toBe(MD3LightTheme.spacing.x3);
        expect(rounded.borderRadius).toBe(MD3LightTheme.roundness * 4);
    });
});

describe('list slots', () => {
    it('caches one icon slot per icon and colour', () => {
        expect(iconSlot('folder')).toBe(iconSlot('folder'));
        expect(iconSlot('folder', 'red')).not.toBe(iconSlot('folder'));
    });

    it('serves a node as given', () => {
        const node = <Text>x</Text>;
        expect(nodeSlot(node)()).toBe(node);
    });
});
