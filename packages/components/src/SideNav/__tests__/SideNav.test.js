import React from 'react';
import { Platform, Text, View } from 'react-native';
import renderer, { act } from 'react-test-renderer';

import { Drawer, MD3LightTheme, Provider } from '@jmstechnologiesinc/react-native-paper';

import SideNav from '../SideNav';

jest.useFakeTimers();

const MENU = [
    { key: 'queue', title: 'Queue', icon: 'inbox-outline' },
    { key: 'rules', title: 'Rules', icon: 'scale-balance' },
];

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

const containerOf = (tree, testID) => tree.root.find((node) => node.type === View && node.props.testID === testID);

const activeOf = (tree, Component) =>
    tree.root.findAll((node) => node.type === Component).map((node) => node.props.active);

describe('SideNav', () => {
    it.each([false, true])('gives every item a key (expanded: %s)', (isExpanded) => {
        const error = jest.spyOn(console, 'error').mockImplementation(() => {});
        render(<SideNav isExpanded={isExpanded} menuItems={MENU} onPress={() => {}} />);
        expect(error.mock.calls.filter(([message]) => String(message).includes('unique "key"'))).toEqual([]);
    });

    it('still selects by index, as before', () => {
        const tree = render(<SideNav menuItems={MENU} selectedIndex={1} onPress={() => {}} />);
        expect(activeOf(tree, Drawer.CollapsedItem)).toEqual([false, true]);
    });

    it('selects by key when given one', () => {
        const tree = render(
            <SideNav isExpanded menuItems={MENU} selectedIndex={1} selectedKey="queue" onPress={() => {}} />
        );
        expect(activeOf(tree, Drawer.Item)).toEqual([true, false]);
    });

    it('draws the header slot above the items', () => {
        const tree = render(<SideNav menuItems={MENU} renderHeader={() => <Text>fab</Text>} onPress={() => {}} />);
        expect(JSON.stringify(tree.toJSON())).toContain('fab');
    });

    it('reports the pressed item', () => {
        const onPress = jest.fn();
        const tree = render(<SideNav menuItems={MENU} onPress={onPress} />);
        act(() => tree.root.findAll((node) => node.type === Drawer.CollapsedItem)[1].props.onPress());
        expect(onPress).toHaveBeenCalledWith(MENU[1]);
    });

    it('keeps the drawer gap under the first collapsed item by default', () => {
        const tree = render(<SideNav menuItems={MENU} onPress={() => {}} />);
        const wrappers = tree.root.findAll((node) => node.type === Drawer.CollapsedItem).map((node) => node.parent);
        expect(wrappers[0].props.style).toEqual({ marginBottom: MD3LightTheme.spacing.x14 });
        expect(wrappers[1].props.style).toBeNull();
    });

    it('spaces every destination evenly as an MD3 rail', () => {
        const tree = render(<SideNav variant="rail" menuItems={MENU} onPress={() => {}} />);
        const wrappers = tree.root.findAll((node) => node.type === Drawer.CollapsedItem).map((node) => node.parent);
        expect(wrappers.map((wrapper) => wrapper.props.style)).toEqual([null, null]);
    });

    it('forwards testID and accessibilityLabel to each destination button', () => {
        const items = MENU.map((item) => ({
            ...item,
            testID: `rail-${item.key}`,
            accessibilityLabel: `${item.title}, 3 new`,
        }));
        const tree = render(<SideNav variant="rail" menuItems={items} selectedKey="rules" onPress={() => {}} />);
        const button = tree.root.findByProps({ testID: 'rail-rules', accessible: true });
        expect(button.props.accessibilityLabel).toBe('Rules, 3 new');
        expect(button.props.accessibilityRole).toBe('button');
        expect(button.props.accessibilityState).toMatchObject({ selected: true });
        expect(
            tree.root.findByProps({ testID: 'rail-queue', accessible: true }).props.accessibilityState
        ).toMatchObject({
            selected: false,
        });
    });

    it('labels the container as navigation', () => {
        const tree = render(
            <SideNav
                accessibilityRole="navigation"
                accessibilityLabel="Main"
                testID="rail"
                menuItems={MENU}
                onPress={() => {}}
            />
        );
        expect(containerOf(tree, 'rail').props).toMatchObject({
            accessibilityRole: 'navigation',
            accessibilityLabel: 'Main',
        });
    });

    describe('on the web', () => {
        beforeEach(() => jest.replaceProperty(Platform, 'OS', 'web'));

        it('puts ARIA, not the deprecated props, on the container', () => {
            const tree = render(
                <SideNav
                    accessibilityRole="navigation"
                    accessibilityLabel="Main"
                    testID="rail"
                    menuItems={MENU}
                    onPress={() => {}}
                />
            );
            const { props } = containerOf(tree, 'rail');
            expect(props).toMatchObject({ role: 'navigation', 'aria-label': 'Main' });
            expect(props.accessibilityRole).toBeUndefined();
            expect(props.accessibilityLabel).toBeUndefined();
        });

        it.each([false, true])('marks the item wrappers for the aria-current sync (expanded: %s)', (isExpanded) => {
            const tree = render(<SideNav isExpanded={isExpanded} menuItems={MENU} onPress={() => {}} />);
            const marked = tree.root.findAll((node) => typeof node.type === 'string' && node.props.dataSet);
            expect(marked.map((node) => node.props.dataSet)).toEqual([{ sideNavItem: '0' }, { sideNavItem: '1' }]);
        });

        it('sets aria-current="page" on the selected destination button only, and moves it', () => {
            // react-native-web hands the ref the DOM node; this is the shape SideNav reads from it.
            const buttons = MENU.map(() => {
                const attributes = {};
                return {
                    attributes,
                    setAttribute: (name, value) => {
                        attributes[name] = value;
                    },
                    removeAttribute: (name) => {
                        delete attributes[name];
                    },
                };
            });
            const items = buttons.map((button, index) => ({
                getAttribute: (name) => (name === 'data-side-nav-item' ? String(index) : null),
                querySelector: (selector) => (selector === '[role="button"]' ? button : null),
            }));
            const sideNav = (selectedKey) => (
                <SideNav variant="rail" testID="rail" menuItems={MENU} selectedKey={selectedKey} onPress={() => {}} />
            );
            const rerender = (tree, selectedKey) =>
                act(() => tree.update(<Provider theme={MD3LightTheme}>{sideNav(selectedKey)}</Provider>));
            const current = () => buttons.map((button) => button.attributes['aria-current']);

            const tree = render(sideNav('rules'));
            // Under Jest the ref is RN's mocked View, not a DOM node: give it the DOM's query method.
            containerOf(tree, 'rail').instance.querySelectorAll = (selector) =>
                selector === '[data-side-nav-item]' ? items : [];

            rerender(tree, 'rules');
            expect(current()).toEqual([undefined, 'page']);

            rerender(tree, 'queue');
            expect(current()).toEqual(['page', undefined]);

            rerender(tree, null);
            expect(current()).toEqual([undefined, undefined]);
        });
    });
});
