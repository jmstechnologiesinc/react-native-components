import React from 'react';

import { List } from '@jmstechnologiesinc/react-native-paper';

// Render props for Paper `List.Item` slots (`left`, `right`, `description`),
// built outside the component so a row does not define a new component on
// every render (react/no-unstable-nested-components). Paper calls a slot as a
// function (`left(props)`), so the element it returns keeps its type across
// renders and nothing remounts; icon slots are cached, so a row's props stay
// equal from one render to the next.

const iconSlots = new Map();

/**
 * A `List.Icon` in a slot; `color` defaults to the one `List.Item` passes. One function per icon and
 * colour.
 *
 * @param {string} icon
 * @param {string} [color]
 */
export const iconSlot = (icon, color) => {
    const key = `${icon}|${color ?? ''}`;
    if (!iconSlots.has(key)) {
        iconSlots.set(key, function IconSlot(props) {
            return <List.Icon {...props} icon={icon} color={color ?? props.color} />;
        });
    }
    return iconSlots.get(key);
};

/** A ready-made node in a slot. @param {React.ReactNode} node */
export const nodeSlot = (node) => () => node;
