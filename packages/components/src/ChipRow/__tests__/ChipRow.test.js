import React from 'react';
import { Text } from 'react-native';
import renderer, { act } from 'react-test-renderer';

import { MD3LightTheme, Provider } from '@jmstechnologiesinc/react-native-paper';

import ChipRow from '../ChipRow';

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
});

const rowOf = (tree) => tree.root.findAll((node) => node.type === 'View' && node.props.testID === 'row')[0];
const flatStyle = (node) => Object.assign({}, ...[node.props.style].flat(Infinity).filter(Boolean));

describe('ChipRow', () => {
    it('wraps its chips with the theme’s 8dp gap, and is plain layout without a name', () => {
        const tree = render(
            <ChipRow testID="row">
                <Text>one</Text>
                <Text>two</Text>
            </ChipRow>
        );
        const row = rowOf(tree);
        expect(flatStyle(row)).toMatchObject({ flexDirection: 'row', flexWrap: 'wrap', gap: MD3LightTheme.spacing.x2 });
        expect(row.props.role).toBeUndefined();
        expect(tree.root.findAll((node) => node.type === 'View' && node.props.role === 'listitem')).toHaveLength(0);
    });

    it('is a named list of listitems when it carries an accessibility label, skipping empty slots', () => {
        const tree = render(
            <ChipRow accessibilityLabel="Roles" testID="row">
                <Text key="a">driver</Text>
                {null}
                <Text key="b">vendor</Text>
            </ChipRow>
        );
        const row = rowOf(tree);
        expect(row.props.role).toBe('list');
        expect(row.props['aria-label']).toBe('Roles');
        expect(tree.root.findAll((node) => node.type === 'View' && node.props.role === 'listitem')).toHaveLength(2);
    });

    it('right-aligns the chips of a header', () => {
        const tree = render(
            <ChipRow align="end" testID="row">
                <Text>one</Text>
            </ChipRow>
        );
        expect(flatStyle(rowOf(tree))).toMatchObject({ justifyContent: 'flex-end' });
    });

    it('scales its gap with the host theme', () => {
        const theme = { ...MD3LightTheme, spacing: { ...MD3LightTheme.spacing, x2: 11 } };
        let tree;
        act(() => {
            tree = renderer.create(
                <Provider theme={theme}>
                    <ChipRow testID="row">
                        <Text>one</Text>
                    </ChipRow>
                </Provider>
            );
        });
        mounted.push(tree);
        expect(flatStyle(rowOf(tree)).gap).toBe(11);
    });
});
