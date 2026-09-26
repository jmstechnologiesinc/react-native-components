import React from 'react';
import { Platform, View } from 'react-native';
import renderer, { act } from 'react-test-renderer';

import { MD3LightTheme, Provider, TouchableRipple } from '@jmstechnologiesinc/react-native-paper';
import { moderateScale } from '@jmstechnologiesinc/react-native-size-matters';

import ChipList from '../../ChipList/ChipList';
import * as Tabs from '../Tabs';

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
    jest.restoreAllMocks();
});

// The host node a screen reader (or the DOM) gets for a testID.
const hostOf = (tree, testID) =>
    tree.root.find((node) => typeof node.type === 'string' && node.props.testID === testID);

// The props Tabs.Item hands to Paper's ripple. On the web react-native-web's Pressable forwards them to the
// DOM as they are; React Native's own Pressable (the one Jest runs) folds `aria-*` into accessibilityState
// before the host node, so the web assertions read them here.
const passedTo = (tree, testID) =>
    tree.root.find((node) => node.type === TouchableRipple && node.props.testID === testID);

const flatStyle = (style) => Object.assign({}, ...[style].flat(Infinity).filter(Boolean));

const tabBar = (props = {}, selected = 1) => (
    <Tabs.Scrollable currentIndex={selected} accessibilityLabel="Sections" testID="tabs" {...props}>
        {['a', 'b', 'c'].map((key, index) => (
            <Tabs.Item key={key} testID={`tab-${key}`} title={key} isSelected={index === selected} onPress={() => {}} />
        ))}
    </Tabs.Scrollable>
);

describe('Tabs semantics (native)', () => {
    it('makes the list a labelled tablist and each item a tab with its selected state', () => {
        const tree = render(tabBar());
        expect(hostOf(tree, 'tabs').props).toMatchObject({
            accessibilityRole: 'tablist',
            accessibilityLabel: 'Sections',
        });
        expect(hostOf(tree, 'tab-a').props).toMatchObject({
            accessibilityRole: 'tab',
            accessibilityState: expect.objectContaining({ selected: false }),
        });
        expect(hostOf(tree, 'tab-b').props.accessibilityState).toMatchObject({ selected: true });
    });

    it('labels a tab and reports it disabled', () => {
        const tree = render(<Tabs.Item testID="tab" title="Rules" accessibilityLabel="Rules, 2 pending" disabled />);
        expect(hostOf(tree, 'tab').props).toMatchObject({
            accessibilityLabel: 'Rules, 2 pending',
            accessibilityState: expect.objectContaining({ selected: false, disabled: true }),
        });
    });

    it('lets a non-tab row opt out of the role (ChipList)', () => {
        const tree = render(<ChipList options={['All', 'Open']} currentIndex={0} onPress={() => {}} />);
        const roles = tree.root
            .findAll((node) => typeof node.type === 'string')
            .map((node) => node.props.accessibilityRole);
        expect(roles).not.toContain('tablist');
    });
});

describe('Tabs.Item indicator', () => {
    it('keeps the 2dp full-width underline by default', () => {
        const tree = render(<Tabs.Item testID="tab" title="A" isSelected />);
        expect(flatStyle(hostOf(tree, 'tab').props.style)).toMatchObject({
            borderBottomWidth: moderateScale(2),
            borderColor: MD3LightTheme.colors.primary,
        });
    });

    it('draws the MD3 primary indicator: 3dp, rounded top, no border on the tab', () => {
        const tree = render(<Tabs.Item testID="tab" title="A" isSelected variant="primary" />);
        const tab = hostOf(tree, 'tab');
        expect(flatStyle(tab.props.style).borderBottomWidth).toBeUndefined();

        const indicator = tab.findAll(
            (node) => node.type === View && flatStyle(node.props.style).backgroundColor === MD3LightTheme.colors.primary
        );
        expect(indicator).toHaveLength(1);
        expect(flatStyle(indicator[0].props.style)).toMatchObject({
            position: 'absolute',
            bottom: 0,
            height: moderateScale(3),
            borderTopLeftRadius: moderateScale(3),
            borderTopRightRadius: moderateScale(3),
        });
    });

    it('is 48dp tall whether selected or not, so the row does not shift', () => {
        const heights = [true, false].map((isSelected) => {
            const tree = render(<Tabs.Item testID="tab" title="A" isSelected={isSelected} variant="primary" />);
            const content = hostOf(tree, 'tab').findAll(
                (node) => typeof node.type === 'string' && flatStyle(node.props.style).minHeight
            )[0];
            return flatStyle(content.props.style).minHeight;
        });
        expect(heights).toEqual([MD3LightTheme.spacing.x12, MD3LightTheme.spacing.x12]);
    });
});

describe('Tabs on the web', () => {
    beforeEach(() => jest.replaceProperty(Platform, 'OS', 'web'));

    it('puts ARIA on the list and the tabs, and only the selected tab in the Tab order', () => {
        const tree = render(tabBar());
        const list = hostOf(tree, 'tabs').props;
        expect(list).toMatchObject({ role: 'tablist', 'aria-label': 'Sections' });
        expect(list.accessibilityRole).toBeUndefined();
        expect(typeof list.onKeyDown).toBe('function');

        const tabs = ['a', 'b', 'c'].map((key) => passedTo(tree, `tab-${key}`).props);
        expect(tabs.map((tab) => tab.role)).toEqual(['tab', 'tab', 'tab']);
        expect(tabs.map((tab) => tab['aria-selected'])).toEqual([false, true, false]);
        expect(tabs.map((tab) => tab.accessibilityState.selected)).toEqual([false, true, false]);
        expect(tabs.map((tab) => tab.tabIndex)).toEqual([-1, 0, -1]);
    });

    it('reports a disabled tab with aria-disabled', () => {
        const tree = render(<Tabs.Item testID="tab" title="A" disabled />);
        expect(passedTo(tree, 'tab').props['aria-disabled']).toBe(true);
    });

    it('gives a ChipList row no tablist role and no keyboard handler', () => {
        const tree = render(<ChipList options={['All', 'Open']} currentIndex={0} onPress={() => {}} />);
        const hosts = tree.root.findAll((node) => typeof node.type === 'string');
        expect(hosts.map((node) => node.props.role)).not.toContain('tablist');
        expect(hosts.some((node) => node.props.onKeyDown)).toBe(false);
    });

    describe('keyboard', () => {
        // The DOM react-native-web renders: the list is the event's currentTarget, the tabs its `[role="tab"]`s.
        const domTabs = (count, disabledIndex) =>
            Array.from({ length: count }, (_, index) => ({
                index,
                focus: jest.fn(),
                click: jest.fn(),
                contains: () => false,
                getAttribute: (name) => (name === 'aria-disabled' && index === disabledIndex ? 'true' : null),
            }));

        const press = (tree, key, tabs, from, { rtl = false } = {}) => {
            const event = {
                key,
                target: tabs[from],
                currentTarget: {
                    querySelectorAll: () => tabs,
                    closest: (selector) => (rtl && selector === '[dir="rtl"]' ? {} : null),
                },
                preventDefault: jest.fn(),
            };
            hostOf(tree, 'tabs').props.onKeyDown(event);
            return event;
        };

        const reached = (tabs) => tabs.filter((tab) => tab.click.mock.calls.length).map((tab) => tab.index);

        it.each([
            ['ArrowRight', 1, 2],
            ['ArrowRight', 3, 0],
            ['ArrowLeft', 1, 0],
            ['ArrowLeft', 0, 3],
            ['Home', 2, 0],
            ['End', 1, 3],
        ])('%s from tab %i focuses and selects tab %i', (key, from, to) => {
            const tree = render(tabBar());
            const tabs = domTabs(4);
            const event = press(tree, key, tabs, from);
            expect(event.preventDefault).toHaveBeenCalled();
            expect(tabs[to].focus).toHaveBeenCalled();
            expect(reached(tabs)).toEqual([to]);
        });

        it('mirrors the arrows in RTL', () => {
            const tree = render(tabBar());
            const tabs = domTabs(3);
            press(tree, 'ArrowRight', tabs, 1, { rtl: true });
            expect(reached(tabs)).toEqual([0]);
        });

        it('skips a disabled tab', () => {
            const tree = render(tabBar());
            const tabs = domTabs(3, 1);
            press(tree, 'ArrowRight', tabs, 0);
            expect(reached(tabs)).toEqual([2]);
        });

        it('leaves other keys alone', () => {
            const tree = render(tabBar());
            const tabs = domTabs(3);
            const event = press(tree, 'Enter', tabs, 0);
            expect(event.preventDefault).not.toHaveBeenCalled();
            expect(reached(tabs)).toEqual([]);
        });

        it('does not re-select the tab already focused', () => {
            const tree = render(tabBar());
            const tabs = domTabs(3);
            press(tree, 'Home', tabs, 0);
            expect(reached(tabs)).toEqual([]);
        });
    });

    it('keeps the first tab reachable when none is selected (roving tabindex)', () => {
        const tree = render(tabBar({}, -1));
        const attributes = [{}, {}, {}];
        const tabs = attributes.map((attrs) => ({
            getAttribute: (name) => (name === 'aria-selected' ? 'false' : null),
            setAttribute: (name, value) => {
                attrs[name] = value;
            },
        }));
        // Under Jest the ref is RN's mocked View, not a DOM node: give it the DOM's query method.
        tree.root.find((node) => node.type === View && node.props.testID === 'tabs').instance.querySelectorAll = () =>
            tabs;
        act(() => tree.update(<Provider theme={MD3LightTheme}>{tabBar({}, -1)}</Provider>));
        expect(attributes.map((attrs) => attrs.tabindex)).toEqual(['0', '-1', '-1']);
    });
});
