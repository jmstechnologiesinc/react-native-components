jest.mock('react-native-localize', () => ({
    findBestLanguageTag: jest.fn(() => ({ languageTag: 'en', isRTL: false })),
}));

import React from 'react';
import renderer, { act } from 'react-test-renderer';

import { List, MD3LightTheme, Provider } from '@jmstechnologiesinc/react-native-paper';

import { setI18nConfig } from '../../Localization/Localization';
import MutedText from '../../MutedText/MutedText';
import ScreenWrapperSection from '../ScreenWrapperSection';

// A section's description is MD3's supporting text under its subheader: the theme's muted body text, on the spacing
// grid, so it follows the theme instead of a hand-picked size and colour.

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

describe('ScreenWrapperSection', () => {
    it('writes its description as muted supporting text under its title', () => {
        const tree = render(<ScreenWrapperSection title="Payouts" description="Where your earnings go" />);
        expect(tree.root.findByType(List.Subheader).props.children).toBe('Payouts');
        const description = tree.root.findByType(MutedText);
        expect(description.props.children).toBe('Where your earnings go');
        expect(description.props.style).toEqual({ paddingBottom: MD3LightTheme.spacing.x3 });
    });

    it('has no supporting text without a description', () => {
        const tree = render(<ScreenWrapperSection title="Payouts" />);
        expect(tree.root.findAllByType(MutedText)).toHaveLength(0);
    });
});
