import React from 'react';

import { FAB } from '@jmstechnologiesinc/react-native-paper';

import SideNav from './SideNav';

const menuItems = [
    {
        title: 'Item 1',
        icon: 'car',
    },
    {
        title: 'Deliveries',
        icon: 'bookmark-outline',
    },
    {
        title: 'Settings',
        icon: 'cog-outline',
    },
];

export default {
    title: 'packages/SideNav',
};

export const Collapsed = () => {
    return <SideNav menuItems={menuItems} />;
};

export const CollapsedSelected = () => {
    return <SideNav menuItems={menuItems} selectedIndex={1} />;
};

export const Expanded = () => {
    return <SideNav isExpanded menuItems={menuItems} />;
};

export const ExpandedSelected = () => {
    return <SideNav isExpanded menuItems={menuItems} selectedIndex={1} />;
};

export const CollapsedWithHeader = () => (
    <SideNav
        menuItems={menuItems.map((item, index) => ({ ...item, key: `item-${index}` }))}
        selectedKey="item-1"
        renderHeader={() => <FAB icon="plus" accessibilityLabel="New" onPress={() => {}} />}
    />
);

// MD3 navigation rail: destinations evenly spaced under the header group, the container labelled as
// navigation, each destination with its own testID (and `aria-current="page"` on the web).
export const Rail = () => (
    <SideNav
        variant="rail"
        accessibilityRole="navigation"
        accessibilityLabel="Main"
        testID="rail"
        menuItems={menuItems.map((item, index) => ({ ...item, key: `item-${index}`, testID: `rail-item-${index}` }))}
        selectedKey="item-0"
        renderHeader={() => <FAB icon="plus" accessibilityLabel="New" onPress={() => {}} />}
        onPress={() => {}}
    />
);
