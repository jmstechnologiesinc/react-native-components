jest.mock('react-native-localize', () => ({
    findBestLanguageTag: jest.fn(() => ({ languageTag: 'en', isRTL: false })),
}));

import React from 'react';
import { Dimensions, FlatList } from 'react-native';
import renderer, { act } from 'react-test-renderer';

import { Card, MD3LightTheme, Provider } from '@jmstechnologiesinc/react-native-paper';

import { paneMetrics } from '../../Layout/metrics';
import { setI18nConfig } from '../../Localization/Localization';
import { sectionPaddings } from '../../ScreenWrapper/ScreenWrapperSection';
import VendorList from '../VendorList';

// The vendors as MD3's feed: one column of cards on a phone, more where they fit, each card as wide as its column
// and its photo fetched at that width.

const INITIAL_WINDOW = Dimensions.get('window');
// The theme's tokens are scaled under jest (size-matters on the default window): widths are taken from the theme.
const GAP = MD3LightTheme.spacing.x4;
const MARGINS = sectionPaddings.left + sectionPaddings.right;
const TWO_COLUMNS = 2 * paneMetrics(MD3LightTheme).fixedPane + GAP + MARGINS;
// A card is whole dp wide (Layout `feedColumns`).
const PHONE_CARD = Math.floor(390 - MARGINS);

const vendor = (id, photo) => ({
    id,
    title: `Vendor ${id}`,
    photos: [photo],
    industries: [],
    formattedFulfillmentMethod: 'Delivery',
    formattedHitDistance: '0.9 mi',
});
const SECTIONS = [{ data: [vendor('a', 'vendors/a.jpg'), vendor('b', 'https://example.com/b.jpg')] }];

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
    });
    act(() => {
        Dimensions.set({ window: INITIAL_WINDOW });
    });
});

beforeAll(() => setI18nConfig());

const listOf = (tree) => tree.root.findByType(FlatList);
const cardsOf = (tree) => tree.root.findAllByType(Card);
const flatStyle = (style) => Object.assign({}, ...[style].flat(Infinity).filter(Boolean));
const measure = (tree, width) => act(() => listOf(tree).props.onLayout({ nativeEvent: { layout: { width } } }));
const list = () => <VendorList sections={SECTIONS} withPaddingHorizontal onPress={() => {}} />;

describe('VendorList', () => {
    it("on a phone, is one column of cards as wide as the screen's margins leave", () => {
        const tree = render(list());
        measure(tree, 390);
        expect(listOf(tree).props.numColumns).toBe(1);
        expect(listOf(tree).props.columnWrapperStyle).toBeUndefined();
        expect(flatStyle(cardsOf(tree)[0].props.style)).toEqual(
            expect.objectContaining({
                width: PHONE_CARD,
                marginLeft: sectionPaddings.left,
                marginRight: sectionPaddings.right,
            })
        );
    });

    it('lays the cards out in columns where two fit, the rows keeping the margins and the gap', () => {
        const width = TWO_COLUMNS + 100;
        const tree = render(list());
        measure(tree, width);
        expect(listOf(tree).props.numColumns).toBe(2);
        expect(flatStyle(listOf(tree).props.columnWrapperStyle)).toEqual({
            gap: GAP,
            paddingLeft: sectionPaddings.left,
            paddingRight: sectionPaddings.right,
        });
        const cardStyle = flatStyle(cardsOf(tree)[0].props.style);
        expect(cardStyle.width).toBe(Math.floor((width - MARGINS - GAP) / 2));
        expect(cardStyle.marginLeft).toBeUndefined();
    });

    it('is a new list when its number of columns changes, as React Native requires', () => {
        const tree = render(list());
        measure(tree, 390);
        const singleColumn = listOf(tree);
        measure(tree, TWO_COLUMNS);
        expect(listOf(tree)).not.toBe(singleColumn);
        expect(listOf(tree).props.numColumns).toBe(2);
    });

    it("fetches a vendor's photo from ImageKit at its card's width, cropped to the cover's 16:9", () => {
        const tree = render(list());
        measure(tree, 390);
        const [ownPhoto, publicPhoto] = tree.root.findAllByType(Card.Cover).map((cover) => cover.props.source);
        expect(ownPhoto.uri).toContain(`tr:w-${PHONE_CARD},ar-16-9,`);
        expect(ownPhoto.uri).toMatch(/\/vendors\/a\.jpg$/);
        expect(ownPhoto.lqipUri).toContain(`tr:w-${PHONE_CARD},ar-16-9,q-1,bl-10,f-webp/`);
        // A public photo is shown as it is.
        expect(publicPhoto.uri).toBe('https://example.com/b.jpg');
    });
});
