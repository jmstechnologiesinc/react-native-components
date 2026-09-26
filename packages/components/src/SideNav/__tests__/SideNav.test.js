import React from 'react';
import { Text } from 'react-native';
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
});
