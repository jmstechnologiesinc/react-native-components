import React from 'react';
import { Dimensions, ScrollView, Text } from 'react-native';
import renderer, { act } from 'react-test-renderer';

import TabsScrollable from '../TabsScrollable';

const widthOf = (tree) => {
    const style = tree.root.findByType(ScrollView).props.style;
    return Object.assign({}, ...style.filter(Boolean)).width;
};

const render = () => {
    let tree;
    act(() => {
        tree = renderer.create(
            <TabsScrollable currentIndex={0}>
                <Text key="a">A</Text>
                <Text key="b">B</Text>
            </TabsScrollable>
        );
    });
    return tree;
};

describe('Tabs.Scrollable', () => {
    it('follows the window width instead of freezing it at module load', () => {
        const tree = render();
        expect(widthOf(tree)).toBe(Dimensions.get('window').width);

        act(() => {
            Dimensions.set({ window: { ...Dimensions.get('window'), width: 1440 } });
        });
        expect(widthOf(tree)).toBe(1440);
        act(() => tree.unmount());
    });

    it('lets a host size the bar to its container', () => {
        let tree;
        act(() => {
            tree = renderer.create(
                <TabsScrollable style={{ width: '100%' }}>
                    <Text key="a">A</Text>
                </TabsScrollable>
            );
        });
        expect(widthOf(tree)).toBe('100%');
        act(() => tree.unmount());
    });

    it('centres the current tab against the width the bar was laid out at', () => {
        const tree = render();
        const instance = tree.root.findByType(TabsScrollable).instance;
        const layout = (width, x = 0) => ({ nativeEvent: { layout: { x, y: 0, width, height: 48 } } });

        instance.onScrollViewLayout(layout(300));
        instance.onTabsContainerLayout(layout(1000));
        instance.onTabsItemLayout(0)(layout(100, 0));
        instance.onTabsItemLayout(1)(layout(100, 500));
        act(() => {
            tree.update(
                <TabsScrollable currentIndex={1}>
                    <Text key="a">A</Text>
                    <Text key="b">B</Text>
                </TabsScrollable>
            );
        });

        // 500 - (300 - 100) / 2: the tab centred in a 300-wide bar, not a window-wide one.
        expect(instance.getScrollAmount()).toBe(400);
        act(() => tree.unmount());
    });
});
