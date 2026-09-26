// C-35 — `ButtonWrapper` is Paper only, so the portable entry serves it.
import React from 'react';
import renderer, { act } from 'react-test-renderer';

import { MD3LightTheme, Provider } from '@jmstechnologiesinc/react-native-paper';

import ButtonWrapper from '../ButtonWrapper';
import { ButtonWrapper as PortableButtonWrapper } from '../../portable';

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

const buttonOf = (tree) => tree.root.findAll((node) => node.props.accessibilityRole === 'button')[0];

describe('ButtonWrapper', () => {
    it('is the same component in the portable entry', () => {
        expect(PortableButtonWrapper).toBe(ButtonWrapper);
    });

    it('renders its title and calls onPress', () => {
        const onPress = jest.fn();
        const tree = render(<ButtonWrapper title="Add vehicle" onPress={onPress} />);
        expect(JSON.stringify(tree.toJSON())).toContain('Add vehicle');
        act(() => buttonOf(tree).props.onPress());
        expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('is disabled under isDisabled', () => {
        const onPress = jest.fn();
        const tree = render(<ButtonWrapper title="Add" isDisabled onPress={onPress} />);
        expect(buttonOf(tree).props.accessibilityState).toEqual(expect.objectContaining({ disabled: true }));
    });
});
