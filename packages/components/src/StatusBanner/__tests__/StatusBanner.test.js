jest.mock('react-native-localize', () => ({
    findBestLanguageTag: jest.fn(() => ({ languageTag: 'en', isRTL: false })),
}));

import React from 'react';
import { StyleSheet } from 'react-native';
import renderer, { act } from 'react-test-renderer';

import { Banner, Button, MD3LightTheme, Provider } from '@jmstechnologiesinc/react-native-paper';

import { setI18nConfig } from '../../Localization/Localization';
import { STATUS_TONES, TONE_ICONS, toneColors } from '../../tones';
import StatusBanner from '../StatusBanner';

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

describe('StatusBanner', () => {
    it('is a Paper Banner painted with the tone’s container, its icon and the message', () => {
        const tree = render(<StatusBanner tone={STATUS_TONES.danger} message="Insurance expired" testID="banner" />);
        const banner = tree.root.findByType(Banner);
        const colors = toneColors(MD3LightTheme, STATUS_TONES.danger);
        expect(banner.props.visible).toBe(true);
        expect(banner.props.icon).toBe(TONE_ICONS.danger);
        expect(StyleSheet.flatten(banner.props.style).backgroundColor).toBe(colors.container);
        expect(textOf(tree)).toContain('Insurance expired');
        // The message is drawn in the tone's foreground.
        expect(textOf(tree)).toContain(colors.onContainer);
    });

    it('defaults to info, draws no icon on request, and runs its actions', () => {
        const onPress = jest.fn();
        const tree = render(<StatusBanner message="Draft" icon={null} actions={[{ label: 'Publish', onPress }]} />);
        const banner = tree.root.findByType(Banner);
        expect(banner.props.icon).toBeUndefined();
        expect(StyleSheet.flatten(banner.props.style).backgroundColor).toBe(
            toneColors(MD3LightTheme, STATUS_TONES.info).container
        );
        const button = tree.root.findAllByType(Button).find((node) => node.props.children === 'Publish');
        act(() => button.props.onPress());
        expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('uses the host theme’s success role when it declares one', () => {
        const theme = { ...MD3LightTheme, colors: { ...MD3LightTheme.colors, successContainer: '#B8F397' } };
        let tree;
        act(() => {
            tree = renderer.create(
                <Provider theme={theme}>
                    <StatusBanner tone={STATUS_TONES.success} message="Verified" />
                </Provider>
            );
        });
        mounted.push(tree);
        expect(StyleSheet.flatten(tree.root.findByType(Banner).props.style).backgroundColor).toBe('#B8F397');
    });
});
