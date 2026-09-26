jest.mock('react-native-localize', () => ({
    findBestLanguageTag: jest.fn(() => ({ languageTag: 'en', isRTL: false })),
}));

import React from 'react';
import { Platform } from 'react-native';
import renderer, { act } from 'react-test-renderer';

import { Avatar, MD3LightTheme, Provider } from '@jmstechnologiesinc/react-native-paper';

import { setI18nConfig } from '../../Localization/Localization';
import AvatarDisplay from '../AvatarDisplay';

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

describe('AvatarDisplay', () => {
    it('shows the photo as given, as a labelled image', () => {
        const tree = render(<AvatarDisplay photo="https://cdn.example.com/me.jpg" />);
        const image = tree.root.findByType(Avatar.Image);
        expect(image.props.source).toEqual({ uri: 'https://cdn.example.com/me.jpg' });
        const host = hostOf(tree, 'avatar');
        expect(host.props.accessibilityRole).toBe('image');
        expect(host.props.accessibilityLabel).toBe('Profile photo');
    });

    it('shows the icon without a photo, said as such', () => {
        const tree = render(<AvatarDisplay icon="store" />);
        expect(tree.root.findAllByType(Avatar.Image)).toHaveLength(0);
        expect(tree.root.findByType(Avatar.Icon).props.icon).toBe('store');
        expect(hostOf(tree, 'avatar').props.accessibilityLabel).toBe('No profile photo');
    });

    it('takes the host’s label, size, testID and the «Changed» marker', () => {
        const tree = render(
            <AvatarDisplay
                photo="https://x/y.jpg"
                accessibilityLabel="Driver photo"
                size={64}
                highlighted
                testID="me"
            />
        );
        expect(hostOf(tree, 'me').props.accessibilityLabel).toBe('Driver photo');
        expect(tree.root.findByType(Avatar.Image).props.size).toBe(64);
        expect(textOf(tree)).toContain('Changed');
    });

    it('carries role and aria-label on the web', () => {
        jest.replaceProperty(Platform, 'OS', 'web');
        const host = hostOf(render(<AvatarDisplay photo="https://x/y.jpg" />), 'avatar');
        expect(host.props.role).toBe('image');
        expect(host.props['aria-label']).toBe('Profile photo');
        jest.restoreAllMocks();
    });
});
