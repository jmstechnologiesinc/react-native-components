jest.mock('react-native-localize', () => ({
    findBestLanguageTag: jest.fn(() => ({ languageTag: 'en', isRTL: false })),
}));

import React from 'react';
import { StyleSheet } from 'react-native';
import renderer, { act } from 'react-test-renderer';

import { Drawer, FAB, MD3LightTheme, Provider } from '@jmstechnologiesinc/react-native-paper';

import { setI18nConfig } from '../../Localization/Localization';
import { NavigationRail, PaneFooter, footerButtons, paneMetrics } from '..';

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

const hostOf = (tree, testID) =>
    tree.root.findAll((node) => typeof node.type === 'string' && node.props.testID === testID)[0];

const pressableOf = (tree, testID) =>
    tree.root.findAll((node) => node.props.testID === testID && typeof node.props.onPress === 'function')[0];

const ITEMS = [
    { key: 'Queue', label: 'Queue', icon: 'tray-full', badge: 3, accessibilityLabel: 'Queue, 3 tasks' },
    { key: 'Rules', label: 'Rules', icon: 'scale-balance' },
];

describe('NavigationRail', () => {
    it('is a labelled navigation landmark on a rail as wide as the theme’s x20', () => {
        const tree = render(<NavigationRail items={ITEMS} onSelect={() => {}} accessibilityLabel="Sections" />);
        const rail = hostOf(tree, 'rail');
        expect(rail.props.accessibilityRole).toBe('navigation');
        expect(rail.props.accessibilityLabel).toBe('Sections');
        const frame = tree.root.findAll(
            (node) => typeof node.type === 'string' && node.props.style && StyleSheet.flatten(node.props.style).width
        )[0];
        expect(StyleSheet.flatten(frame.props.style).width).toBe(paneMetrics(MD3LightTheme).rail);
    });

    it('names the landmark «Navigation» by default', () => {
        const tree = render(<NavigationRail items={ITEMS} onSelect={() => {}} />);
        expect(hostOf(tree, 'rail').props.accessibilityLabel).toBe('Navigation');
    });

    it('gives each destination its testID, name and badge, marks the active one and reports a press', () => {
        const onSelect = jest.fn();
        const tree = render(<NavigationRail items={ITEMS} activeKey="Rules" onSelect={onSelect} />);
        const items = tree.root.findAll((node) => node.type === Drawer.CollapsedItem);

        expect(items.map((item) => item.props.testID)).toEqual(['rail-item-Queue', 'rail-item-Rules']);
        expect(items.map((item) => item.props.accessibilityLabel)).toEqual(['Queue, 3 tasks', 'Rules']);
        expect(items.map((item) => item.props.active)).toEqual([false, true]);
        expect(items[0].props.badge).toBe(3);

        act(() => items[1].props.onPress());
        expect(onSelect).toHaveBeenCalledWith(ITEMS[1]);
    });

    it('draws the menu button and the FAB above the destinations', () => {
        const onFab = jest.fn();
        const onMenu = jest.fn();
        const tree = render(
            <NavigationRail
                items={ITEMS}
                onSelect={() => {}}
                fab={{ icon: 'inbox-arrow-down', label: 'Next task', onPress: onFab }}
                menu={{ label: 'Account', onPress: onMenu }}
            />
        );
        act(() => pressableOf(tree, 'rail-fab').props.onPress());
        act(() => pressableOf(tree, 'rail-menu').props.onPress());
        expect(onFab).toHaveBeenCalledTimes(1);
        expect(onMenu).toHaveBeenCalledTimes(1);
        const fab = tree.root.findByType(FAB);
        expect(fab.props.accessibilityLabel).toBe('Next task');
        expect(fab.props.variant).toBe('tertiary');
    });

    it('disables the FAB while it is busy', () => {
        const tree = render(
            <NavigationRail
                items={ITEMS}
                onSelect={() => {}}
                fab={{ icon: 'inbox-arrow-down', label: 'Next task', onPress: () => {}, loading: true }}
            />
        );
        const fab = tree.root.findByType(FAB);
        expect(fab.props.disabled).toBe(true);
        expect(fab.props.loading).toBe(true);
    });
});

describe('PaneFooter', () => {
    const { colors } = MD3LightTheme;
    const modes = (actions) => footerButtons(actions, colors).map((button) => `${button.title}:${button.mode}`);
    const action = (label, extra = {}) => ({ key: label, label, onPress: () => {}, ...extra });

    it('contains the action flagged primary', () => {
        expect(modes([action('Open', { primary: true }), action('Claim')])).toEqual([
            'Open:contained',
            'Claim:outlined',
        ]);
    });

    it('without a flag, contains the last action that is not adverse', () => {
        expect(modes([action('Claim'), action('Reject', { tone: 'danger' })])).toEqual([
            'Claim:contained',
            'Reject:outlined',
        ]);
    });

    it('never contains an adverse action by default, also when it is the only one', () => {
        expect(modes([action('Deactivate', { tone: 'danger' })])).toEqual(['Deactivate:outlined']);
        expect(footerButtons([action('Deactivate', { tone: 'danger' })], colors)[0].textColor).toBe(colors.error);
    });

    it('paints a contained adverse action in the error colour', () => {
        const [button] = footerButtons([action('Deactivate', { tone: 'danger', primary: true })], colors);
        expect(button.mode).toBe('contained');
        expect(button.theme.colors.primary).toBe(colors.error);
    });

    it('renders its caption and runs an action; nothing at all without either', () => {
        const onPress = jest.fn();
        const tree = render(<PaneFooter caption="Last saved 2 min ago" actions={[action('Save', { onPress })]} />);
        expect(JSON.stringify(tree.toJSON())).toContain('Last saved 2 min ago');
        const save = tree.root.findAll(
            (node) => node.props.children === 'Save' && typeof node.props.onPress === 'function'
        )[0];
        act(() => save.props.onPress());
        expect(onPress).toHaveBeenCalledTimes(1);

        const empty = render(<PaneFooter />);
        expect(hostOf(empty, 'pane-footer')).toBeUndefined();
    });
});
