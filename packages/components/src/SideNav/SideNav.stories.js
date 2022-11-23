import React from 'react';

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
