// C-35 — the display-only gallery a web host renders from resolved URIs.
jest.mock('react-native-localize', () => ({
    findBestLanguageTag: jest.fn(() => ({ languageTag: 'en', isRTL: false })),
}));

import React from 'react';
import renderer, { act } from 'react-test-renderer';

import { MD3LightTheme, Provider } from '@jmstechnologiesinc/react-native-paper';

import { setI18nConfig } from '../../Localization/Localization';
import PhotoGalleryDisplay from '../PhotoGalleryDisplay';

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

beforeAll(() => {
    setI18nConfig();
});

// The HOST node of a testID: what a screen reader reads.
const hostOf = (tree, testID) =>
    tree.root.findAll((node) => typeof node.type === 'string' && node.props.testID === testID)[0];

const URLS = ['https://cdn.example.com/a.jpg', 'https://cdn.example.com/b.jpg', 'https://cdn.example.com/c.jpg'];

describe('PhotoGalleryDisplay', () => {
    it('renders every URI as given, in a horizontal strip', () => {
        const tree = render(<PhotoGalleryDisplay photoUrls={URLS} />);
        expect(hostOf(tree, 'photo-gallery').props.horizontal).toBe(true);
        URLS.forEach((uri, index) => {
            expect(hostOf(tree, `photo-gallery.photo.${index}`).props.source).toEqual({ uri });
        });
    });

    it('labels each photo for a screen reader', () => {
        const tree = render(<PhotoGalleryDisplay photoUrls={URLS} />);
        const photo = hostOf(tree, 'photo-gallery.photo.1');
        expect(photo.props.accessibilityLabel).toBe('Photo 2 of 3');
        expect(photo.props.accessibilityRole).toBe('image');
    });

    it('shows the empty line when there are no photos (and skips blanks)', () => {
        for (const photoUrls of [undefined, [], [null, '']]) {
            const tree = render(<PhotoGalleryDisplay photoUrls={photoUrls} />);
            expect(hostOf(tree, 'photo-gallery')).toBeUndefined();
            expect(hostOf(tree, 'photo-gallery.empty')).toBeDefined();
            expect(JSON.stringify(tree.toJSON())).toContain('No photos');
        }
    });

    it('takes the host’s title, empty label, testID and the «Changed» marker', () => {
        const tree = render(
            <PhotoGalleryDisplay
                photoUrls={[]}
                title="Store photos"
                emptyLabel="Nothing yet"
                testID="store"
                highlighted
            />
        );
        const json = JSON.stringify(tree.toJSON());
        expect(json).toContain('Store photos');
        expect(json).toContain('Nothing yet');
        expect(json).toContain('Changed');
        expect(hostOf(tree, 'store.empty')).toBeDefined();
    });
});
