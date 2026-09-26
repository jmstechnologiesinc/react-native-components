jest.mock('react-native-localize', () => ({
    findBestLanguageTag: jest.fn(() => ({ languageTag: 'en', isRTL: false })),
}));

import React from 'react';
import { Text } from 'react-native';
import renderer, { act } from 'react-test-renderer';

import { Card, MD3LightTheme, Provider } from '@jmstechnologiesinc/react-native-paper';

import { setI18nConfig } from '../../Localization/Localization';
import SectionCard from '../SectionCard';

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

describe('SectionCard', () => {
    it('is a Paper outlined Card with a Card.Title (title, subtitle, trailing) over Card.Content', () => {
        const tree = render(
            <SectionCard title="Task" subtitle="Documents" trailing={<Text>chip</Text>} testID="card">
                <Text>body</Text>
            </SectionCard>
        );
        const card = tree.root.findByType(Card);
        expect(card.props.mode).toBe('outlined');
        expect(card.props.onPress).toBeUndefined();
        const title = tree.root.findByType(Card.Title);
        expect(title.props.title).toBe('Task');
        expect(title.props.subtitle).toBe('Documents');
        expect(title.props.titleVariant).toBe('titleMedium');
        expect(tree.root.findAllByType(Card.Content)).toHaveLength(1);
        const json = textOf(tree);
        expect(json).toContain('chip');
        expect(json).toContain('body');
    });

    it('draws no content section without children, and no trailing slot without trailing', () => {
        const tree = render(<SectionCard title="Empty" />);
        expect(tree.root.findAllByType(Card.Content)).toHaveLength(0);
        expect(tree.root.findByType(Card.Title).props.right).toBeUndefined();
    });
});
