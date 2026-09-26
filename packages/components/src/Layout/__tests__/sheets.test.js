jest.mock('react-native-localize', () => ({
    findBestLanguageTag: jest.fn(() => ({ languageTag: 'en', isRTL: false })),
}));

import React from 'react';
import { BackHandler, Dimensions, Platform, StyleSheet, Text } from 'react-native';
import renderer, { act } from 'react-test-renderer';

import { MD3LightTheme, Provider } from '@jmstechnologiesinc/react-native-paper';

import { setI18nConfig } from '../../Localization/Localization';
import { BOTTOM_SHEET_MAX_HEIGHT, BottomSheet, SideSheet, paneMetrics } from '..';

// The two MD3 modal sheets: closed they render nothing; open, a labelled modal
// dialog in a Portal with a scrim and (with a title) a close button. On the web
// the keyboard contract comes from useModalFocus (driven here through a
// stand-in document, as in DecisionDialogSemantics.test.js); on Android the
// back button dismisses.

jest.useFakeTimers();

const METRICS = paneMetrics(MD3LightTheme);
const mounted = [];

const render = (element, options) => {
    let tree;
    act(() => {
        tree = renderer.create(<Provider theme={MD3LightTheme}>{element}</Provider>, options);
    });
    mounted.push(tree);
    return tree;
};

const unmountAll = () =>
    act(() => {
        mounted.splice(0).forEach((tree) => tree.unmount());
        jest.runOnlyPendingTimers();
    });

afterEach(unmountAll);

beforeAll(() => setI18nConfig());

const hostOf = (tree, testID) =>
    tree.root.findAll((node) => typeof node.type === 'string' && node.props.testID === testID)[0];

const pressableOf = (tree, testID) =>
    tree.root.findAll((node) => node.props.testID === testID && typeof node.props.onPress === 'function')[0];

const press = (tree, testID) => act(() => pressableOf(tree, testID).props.onPress());

const SHEETS = [
    ['SideSheet', SideSheet],
    ['BottomSheet', BottomSheet],
];

describe.each(SHEETS)('%s', (_name, Sheet) => {
    it('renders nothing while closed', () => {
        const tree = render(
            <Sheet visible={false} onDismiss={() => {}} title="Validation" testID="sheet">
                <Text>Inside</Text>
            </Sheet>
        );
        expect(hostOf(tree, 'sheet')).toBeUndefined();
        expect(JSON.stringify(tree.toJSON())).not.toContain('Inside');
    });

    it('is a labelled modal dialog while open, with its content', () => {
        const tree = render(
            <Sheet visible onDismiss={() => {}} title="Validation" testID="sheet">
                <Text>Inside</Text>
            </Sheet>
        );
        const sheet = hostOf(tree, 'sheet');
        expect(sheet.props.role).toBe('dialog');
        expect(sheet.props['aria-modal']).toBe(true);
        expect(sheet.props['aria-label']).toBe('Validation');
        expect(JSON.stringify(tree.toJSON())).toContain('Inside');
        // The scrim is a pointer affordance, hidden from assistive technology.
        expect(hostOf(tree, 'sheet-scrim').props['aria-hidden']).toBe(true);
    });

    it('is named by accessibilityLabel and draws no header without a title', () => {
        const tree = render(
            <Sheet visible onDismiss={() => {}} accessibilityLabel="Case" testID="sheet">
                <Text>Inside</Text>
            </Sheet>
        );
        expect(hostOf(tree, 'sheet').props['aria-label']).toBe('Case');
        expect(tree.root.findAll((node) => node.props.accessibilityLabel === 'Close')).toHaveLength(0);
    });

    it('closes from the close button (host label) and from the scrim', () => {
        const onDismiss = jest.fn();
        const tree = render(
            <Sheet visible onDismiss={onDismiss} title="Validation" closeLabel="Cerrar" testID="sheet">
                <Text>Inside</Text>
            </Sheet>
        );
        const close = tree.root.findAll(
            (node) => node.props.accessibilityLabel === 'Cerrar' && typeof node.props.onPress === 'function'
        )[0];
        act(() => close.props.onPress());
        press(tree, 'sheet-scrim');
        expect(onDismiss).toHaveBeenCalledTimes(2);
    });

    it('closes on the Android back button while open, and only then', () => {
        jest.replaceProperty(Platform, 'OS', 'android');
        const listeners = [];
        jest.spyOn(BackHandler, 'addEventListener').mockImplementation((event, listener) => {
            listeners.push(listener);
            return { remove: () => listeners.splice(listeners.indexOf(listener), 1) };
        });
        const onDismiss = jest.fn();
        const tree = render(<Sheet visible onDismiss={onDismiss} title="Validation" testID="sheet" />);

        expect(listeners).toHaveLength(1);
        expect(listeners[0]()).toBe(true);
        expect(onDismiss).toHaveBeenCalledTimes(1);

        act(() => {
            tree.update(
                <Provider theme={MD3LightTheme}>
                    <Sheet visible={false} onDismiss={onDismiss} title="Validation" testID="sheet" />
                </Provider>
            );
        });
        expect(listeners).toHaveLength(0);
        jest.restoreAllMocks();
    });
});

describe('the sheets’ geometry comes from the theme', () => {
    const window = Dimensions.get('window');

    it('SideSheet: 360dp (at most the window), large corners on the leading side, as tall as the window', () => {
        const tree = render(<SideSheet visible onDismiss={() => {}} testID="sheet" />);
        const style = StyleSheet.flatten(hostOf(tree, 'sheet').props.style);
        expect(style).toEqual(
            expect.objectContaining({
                width: Math.min(METRICS.sideSheetWidth, window.width),
                // iOS (Jest's platform): Paper's Surface keeps the edges on an outer layer.
                height: window.height,
                borderTopLeftRadius: METRICS.sideSheetRadius,
                borderBottomLeftRadius: METRICS.sideSheetRadius,
                backgroundColor: MD3LightTheme.colors.elevation.level1,
            })
        );
    });

    it('BottomSheet: at most 640dp wide and 85% of the window tall, extra-large top corners and a drag handle', () => {
        const tree = render(<BottomSheet visible onDismiss={() => {}} testID="sheet" />);
        const style = StyleSheet.flatten(hostOf(tree, 'sheet').props.style);
        expect(style).toEqual(
            expect.objectContaining({
                width: Math.min(METRICS.bottomSheetMaxWidth, window.width),
                maxHeight: window.height * BOTTOM_SHEET_MAX_HEIGHT,
                borderTopLeftRadius: METRICS.bottomSheetRadius,
                borderTopRightRadius: METRICS.bottomSheetRadius,
            })
        );
        const handle = StyleSheet.flatten(hostOf(tree, 'sheet-handle').props.style);
        expect(handle.width).toBe(METRICS.dragHandle.width);
        expect(handle.height).toBe(METRICS.dragHandle.height);
    });
});

/** A stand-in for the few DOM APIs useModalFocus uses. */
const fakeDom = () => {
    const listeners = new Set();
    const doc = {
        activeElement: null,
        addEventListener: (type, listener) => listeners.add(listener),
        removeEventListener: (type, listener) => listeners.delete(listener),
        contains: () => true,
    };
    const opener = { focus: jest.fn(() => (doc.activeElement = opener)) };
    doc.activeElement = opener;
    const key = (name) =>
        act(() =>
            listeners.forEach((listener) =>
                listener({ key: name, preventDefault: jest.fn(), stopPropagation: jest.fn() })
            )
        );
    return { doc, opener, key, listeners };
};

describe.each(SHEETS)('%s on the web', (_name, Sheet) => {
    const realDocument = global.document;
    let dom;

    beforeEach(() => {
        jest.replaceProperty(Platform, 'OS', 'web');
        dom = fakeDom();
        global.document = dom.doc;
    });

    afterEach(() => {
        unmountAll();
        global.document = realDocument;
        jest.restoreAllMocks();
    });

    it('closes on Esc and gives the focus back to the opener when it closes', () => {
        const onDismiss = jest.fn();
        const tree = render(<Sheet visible onDismiss={onDismiss} title="Validation" />);

        dom.key('Escape');
        expect(onDismiss).toHaveBeenCalledTimes(1);

        act(() => {
            tree.update(
                <Provider theme={MD3LightTheme}>
                    <Sheet visible={false} onDismiss={onDismiss} title="Validation" />
                </Provider>
            );
        });
        expect(dom.opener.focus).toHaveBeenCalled();
        expect(dom.listeners.size).toBe(0);
    });
});
