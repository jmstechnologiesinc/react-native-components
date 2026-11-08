import React from 'react';
import renderer, { act } from 'react-test-renderer';

import { Chip, MD3LightTheme, Provider } from '@jmstechnologiesinc/react-native-paper';
import { ITEM_TYPE, ITEM_TYPE_ICON_MAPPING } from '@jmstechnologiesinc/commons';

import ListItemChip from '../ListItemChip';

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
    });
    jest.restoreAllMocks();
});

const chipOf = (tree) => tree.root.findByType(Chip);

describe('ListItemChip', () => {
    it('draws a needAttention chip flat with its icon, and any other type outlined', () => {
        const attention = chipOf(render(<ListItemChip type={ITEM_TYPE.needAttention} formattedValue="Overdue" />));
        expect(attention.props.mode).toBe('flat');
        expect(attention.props.icon).toBe(ITEM_TYPE_ICON_MAPPING[ITEM_TYPE.needAttention]);
        expect(attention.props.children).toBe('Overdue');

        const plain = chipOf(render(<ListItemChip formattedValue="Due soon" />));
        expect(plain.props.mode).toBe('outlined');
        expect(plain.props.icon).toBeUndefined();
        expect(plain.props.onPress).toBeUndefined();
    });

    it('announces a chip that only shows a value as text, and keeps the call chip a button', () => {
        expect(chipOf(render(<ListItemChip formattedValue="Due soon" />)).props.accessibilityRole).toBe('text');

        const call = chipOf(
            render(<ListItemChip type={ITEM_TYPE.call} formattedValue="(555) 010-0000" value="+15550100000" />)
        );
        expect(call.props.onPress).toEqual(expect.any(Function));
        expect(call.props.accessibilityRole).toBeUndefined();
    });

    // A list renders one chip per row on every render: the chip itself must write nothing to the console.
    it('writes nothing to the console when it renders', () => {
        const log = jest.spyOn(console, 'log').mockImplementation(() => {});
        render(<ListItemChip type={ITEM_TYPE.needAttention} formattedValue="Overdue" />);
        render(<ListItemChip type={ITEM_TYPE.call} formattedValue="(555) 010-0000" value="+15550100000" />);
        expect(log).not.toHaveBeenCalled();
    });
});
