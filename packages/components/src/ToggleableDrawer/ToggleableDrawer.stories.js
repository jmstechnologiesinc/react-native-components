import React from 'react';

import ToggleableDrawer from './ToggleableDrawer';

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
    title: 'packages/ToggleableDrawer',
};

export const Closed = () => {
    return <ToggleableDrawer menuItems={menuItems} />;
};

export const Open = () => {
    return <ToggleableDrawer isExpanded menuItems={menuItems} />;
};
