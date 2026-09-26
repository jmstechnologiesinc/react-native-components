jest.mock('react-native-localize', () => ({
    findBestLanguageTag: jest.fn(() => ({ languageTag: 'en', isRTL: false })),
}));

import React from 'react';
import { Dimensions, StyleSheet, Text } from 'react-native';
import renderer, { act } from 'react-test-renderer';

import { MD3LightTheme, Provider } from '@jmstechnologiesinc/react-native-paper';

import { setI18nConfig } from '../../Localization/Localization';
import { LAYOUT, PANE, Pane, PaneHeader, PaneLayout, paneMetrics, tokenScale, usePaneContext } from '..';

// The pane scaffold per window size: which panes show, how wide, and the
// buttons PaneHeader adds from the layout (back, show supporting, close).

jest.useFakeTimers();

const INITIAL_WINDOW = Dimensions.get('window');
const SCALE = tokenScale(MD3LightTheme);
const METRICS = paneMetrics(MD3LightTheme);

/** Sets the window to `width` raw pixels: MD3 breakpoints are dp, and a web dp is a CSS pixel. */
const setWindow = (width) =>
    act(() => {
        Dimensions.set({ window: { ...INITIAL_WINDOW, width, height: 1000 } });
    });

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
    act(() => {
        Dimensions.set({ window: INITIAL_WINDOW });
    });
});

beforeAll(() => setI18nConfig());

const hostOf = (tree, testID) =>
    tree.root.findAll((node) => typeof node.type === 'string' && node.props.testID === testID)[0];

const pressableOf = (tree, testID) =>
    tree.root.findAll((node) => node.props.testID === testID && typeof node.props.onPress === 'function')[0];

const press = (tree, testID) => act(() => pressableOf(tree, testID).props.onPress());

const slot = (name) => (
    <Pane accessibilityLabel={name} testID={`pane-${name}`}>
        <PaneHeader title={name} testID={`header-${name}`} />
    </Pane>
);

const L3 = { layout: LAYOUT.L3, list: slot('List'), detail: slot('Detail'), supporting: slot('Support') };
const L2A = { layout: LAYOUT.L2A, list: slot('List'), detail: slot('Detail') };
const L2B = { layout: LAYOUT.L2B, primary: slot('Primary'), supporting: slot('Support') };

const inlinePanes = (tree) =>
    ['list', 'detail', 'primary', 'supporting'].filter((role) => hostOf(tree, `pane-layout-${role}`));

const widthOf = (tree, role) => StyleSheet.flatten(hostOf(tree, `pane-layout-${role}`).props.style).width;

const labelOf = (tree, testID) => hostOf(tree, testID)?.props.accessibilityLabel;

describe('PaneLayout', () => {
    it('L3 at XL: three panes side by side, list and supporting 360dp in tokens', () => {
        setWindow(1700);
        const tree = render(<PaneLayout {...L3} />);

        expect(inlinePanes(tree)).toEqual(['list', 'detail', 'supporting']);
        expect(widthOf(tree, 'list')).toBe(METRICS.fixedPane);
        expect(widthOf(tree, 'supporting')).toBe(METRICS.fixedPane);
        expect(widthOf(tree, 'detail')).toBeUndefined();
        expect(StyleSheet.flatten(hostOf(tree, 'pane-layout').props.style).padding).toBe(METRICS.margin);
        expect(StyleSheet.flatten(hostOf(tree, 'pane-layout-detail').props.style).marginLeft).toBe(METRICS.spacer);
        expect(hostOf(tree, 'header-Detail-show-supporting')).toBeUndefined();
    });

    it('reads the class from the raw window width, whatever the token scale: 1700 pixels are XL', () => {
        setWindow(1700);
        const tree = render(<PaneLayout {...L3} />);
        expect(SCALE).toBeGreaterThan(0);
        expect(inlinePanes(tree)).toEqual(['list', 'detail', 'supporting']);
    });

    it('L3 at large: supporting becomes a SideSheet opened from the detail header', () => {
        setWindow(1400);
        const tree = render(<PaneLayout {...L3} supportingLabel="Case" />);

        expect(inlinePanes(tree)).toEqual(['list', 'detail']);
        expect(hostOf(tree, 'pane-layout-supporting-sheet')).toBeUndefined();
        expect(labelOf(tree, 'header-Detail-show-supporting')).toBe('Show side panel');
        expect(hostOf(tree, 'header-List-show-supporting')).toBeUndefined();

        press(tree, 'header-Detail-show-supporting');
        const sheet = hostOf(tree, 'pane-layout-supporting-sheet');
        expect(sheet.props.role).toBe('dialog');
        expect(sheet.props['aria-label']).toBe('Case');
        expect(StyleSheet.flatten(sheet.props.style).width).toBe(METRICS.sideSheetWidth);
        // The pane inside the sheet is flat and its header closes the sheet.
        expect(StyleSheet.flatten(hostOf(tree, 'pane-Support').props.style).borderRadius).toBeUndefined();
        expect(labelOf(tree, 'header-Support-close')).toBe('Close');

        press(tree, 'header-Support-close');
        expect(hostOf(tree, 'pane-layout-supporting-sheet')).toBeUndefined();
    });

    it('L3 at expanded keeps list + detail', () => {
        setWindow(1000);
        const tree = render(<PaneLayout {...L3} />);
        expect(inlinePanes(tree)).toEqual(['list', 'detail']);
    });

    it('L2A at medium: one pane, list ⇄ detail, with a back arrow on the detail', () => {
        setWindow(700);
        const onBack = jest.fn();
        const tree = render(<PaneLayout {...L2A} activePane={PANE.LIST} onBack={onBack} />);
        expect(inlinePanes(tree)).toEqual(['list']);
        expect(hostOf(tree, 'header-List-back')).toBeUndefined();
        // A single pane fills the window.
        expect(widthOf(tree, 'list')).toBeUndefined();

        act(() => {
            tree.update(
                <Provider theme={MD3LightTheme}>
                    <PaneLayout {...L2A} activePane={PANE.DETAIL} onBack={onBack} />
                </Provider>
            );
        });
        expect(inlinePanes(tree)).toEqual(['detail']);
        expect(labelOf(tree, 'header-Detail-back')).toBe('Back');
        press(tree, 'header-Detail-back');
        expect(onBack).toHaveBeenCalledTimes(1);
    });

    it('L2A at large shows both panes and no back arrow', () => {
        setWindow(1400);
        const tree = render(<PaneLayout {...L2A} activePane={PANE.DETAIL} onBack={jest.fn()} />);
        expect(inlinePanes(tree)).toEqual(['list', 'detail']);
        expect(hostOf(tree, 'header-Detail-back')).toBeUndefined();
    });

    it('L2B at expanded keeps primary + supporting', () => {
        setWindow(1000);
        const tree = render(<PaneLayout {...L2B} />);
        expect(inlinePanes(tree)).toEqual(['primary', 'supporting']);
    });

    it('L2B at medium: supporting becomes a BottomSheet toggled from the primary header, reported', () => {
        setWindow(700);
        const onToggleSupporting = jest.fn();
        const tree = render(<PaneLayout {...L2B} onToggleSupporting={onToggleSupporting} />);

        expect(inlinePanes(tree)).toEqual(['primary']);
        press(tree, 'header-Primary-show-supporting');
        expect(hostOf(tree, 'pane-layout-supporting-sheet-handle')).toBeDefined();
        expect(onToggleSupporting).toHaveBeenLastCalledWith(true);

        press(tree, 'pane-layout-supporting-sheet-scrim');
        expect(hostOf(tree, 'pane-layout-supporting-sheet')).toBeUndefined();
        expect(onToggleSupporting).toHaveBeenLastCalledWith(false);
    });

    it('lets the host control the supporting sheet', () => {
        setWindow(1400);
        const onToggleSupporting = jest.fn();
        const tree = render(<PaneLayout {...L3} supportingOpen onToggleSupporting={onToggleSupporting} />);

        expect(hostOf(tree, 'pane-layout-supporting-sheet')).toBeDefined();
        press(tree, 'header-Support-close');
        expect(onToggleSupporting).toHaveBeenCalledWith(false);
        // Controlled: it stays open until the host says otherwise.
        expect(hostOf(tree, 'pane-layout-supporting-sheet')).toBeDefined();
    });

    it('follows a live window resize from XL to medium and back', () => {
        setWindow(1700);
        const tree = render(<PaneLayout {...L3} />);
        expect(inlinePanes(tree)).toEqual(['list', 'detail', 'supporting']);

        setWindow(700);
        expect(inlinePanes(tree)).toEqual(['list']);

        setWindow(1400);
        expect(inlinePanes(tree)).toEqual(['list', 'detail']);
    });

    it('gives an empty slot no room, and no «show supporting» button without a supporting pane', () => {
        setWindow(700);
        const tree = render(<PaneLayout layout={LAYOUT.L2B} primary={slot('Primary')} />);
        expect(inlinePanes(tree)).toEqual(['primary']);
        expect(hostOf(tree, 'header-Primary-show-supporting')).toBeUndefined();
    });

    it('tells each slot its role', () => {
        setWindow(1700);
        const Role = ({ name }) => {
            const { role, inSheet } = usePaneContext();
            return <Text testID={name}>{`${role}:${inSheet}`}</Text>;
        };
        const tree = render(<PaneLayout layout={LAYOUT.L2A} list={<Role name="a" />} detail={<Role name="b" />} />);
        expect(hostOf(tree, 'a').props.children).toBe('list:false');
        expect(hostOf(tree, 'b').props.children).toBe('detail:false');
    });
});

describe('Pane and PaneHeader outside a layout', () => {
    it('Pane is a named surface region with the large shape', () => {
        const tree = render(<Pane accessibilityLabel="Queue" testID="pane" />);
        const pane = hostOf(tree, 'pane');
        expect(pane.props.role).toBe('region');
        expect(pane.props['aria-label']).toBe('Queue');
        const style = StyleSheet.flatten(pane.props.style);
        expect(style.backgroundColor).toBe(MD3LightTheme.colors.surface);
        expect(style.borderRadius).toBe(METRICS.paneRadius);
    });

    it('PaneHeader draws the title, subtitle, actions and its own back arrow with host labels', () => {
        const onBack = jest.fn();
        const onRefresh = jest.fn();
        const tree = render(
            <PaneHeader
                title="Queue"
                subtitle="3 open"
                onBack={onBack}
                backLabel="Atrás"
                actions={[{ icon: 'refresh', label: 'Refresh', onPress: onRefresh, testID: 'refresh' }]}
            />
        );
        const json = JSON.stringify(tree.toJSON());
        expect(json).toContain('Queue');
        expect(json).toContain('3 open');
        expect(labelOf(tree, 'pane-header-back')).toBe('Atrás');
        press(tree, 'refresh');
        press(tree, 'pane-header-back');
        expect(onRefresh).toHaveBeenCalledTimes(1);
        expect(onBack).toHaveBeenCalledTimes(1);
        expect(hostOf(tree, 'pane-header-close')).toBeUndefined();
    });
});
