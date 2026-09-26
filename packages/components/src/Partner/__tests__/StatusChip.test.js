import React from 'react';
import renderer, { act } from 'react-test-renderer';

import { MD3LightTheme, Provider } from '@jmstechnologiesinc/react-native-paper';

import StatusChip, { SlaChip } from '../StatusChip';

// Paper animates on timers; fake ones, and unmounting after each test, keep
// those animations from firing after the environment is torn down.
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

// The HOST node of a testID: what a screen reader reads.
const hostOf = (tree, testID) =>
    tree.root.findAll((node) => typeof node.type === 'string' && node.props.testID === testID)[0];

const chipOf = hostOf;

describe('StatusChip', () => {
    it('labels from the view model and degrades to the raw value', () => {
        const tree = render(<StatusChip kind="partnership" value="rejected" testID="chip" />);
        expect(chipOf(tree, 'chip').props.accessibilityLabel).toBe('rejected');
    });

    it('is announced as text, not as a button', () => {
        const tree = render(<StatusChip kind="verification" value="verified" testID="chip" />);
        expect(chipOf(tree, 'chip').props.accessibilityRole).toBe('text');
    });

    it('takes an explicit label over the catalogue', () => {
        const tree = render(<StatusChip kind="verification" value="verified" label="Checked" testID="chip" />);
        expect(chipOf(tree, 'chip').props.accessibilityLabel).toBe('Checked');
    });

    it.each([
        ['verification', 'verified', MD3LightTheme.colors.tertiaryContainer],
        ['verification', 'unverified', MD3LightTheme.colors.errorContainer],
        ['verification', 'pending', MD3LightTheme.colors.secondaryContainer],
        ['partnership', 'onboarding', MD3LightTheme.colors.primaryContainer],
        ['task_status', 'closed', MD3LightTheme.colors.surfaceVariant],
    ])('%s / %s paints the tone container from the theme', (kind, value, color) => {
        const tree = render(<StatusChip kind={kind} value={value} testID="chip" />);
        const container = hostOf(tree, 'chip-container');
        expect(JSON.stringify(container.props.style)).toContain(color);
    });

    it('follows the host theme, not a static one', () => {
        const theme = {
            ...MD3LightTheme,
            colors: { ...MD3LightTheme.colors, successContainer: 'rgb(1, 2, 3)', onSuccessContainer: 'rgb(4, 5, 6)' },
        };
        let tree;
        act(() => {
            tree = renderer.create(
                <Provider theme={theme}>
                    <StatusChip kind="partnership" value="active" testID="chip" />
                </Provider>
            );
        });
        mounted.push(tree);
        const container = hostOf(tree, 'chip-container');
        expect(JSON.stringify(container.props.style)).toContain('rgb(1, 2, 3)');
    });
});

describe('SlaChip', () => {
    it.each([
        ['on_time', MD3LightTheme.colors.tertiaryContainer],
        ['due_soon', MD3LightTheme.colors.secondaryContainer],
        ['overdue', MD3LightTheme.colors.errorContainer],
        ['unheard_of', MD3LightTheme.colors.surfaceVariant],
    ])('%s is painted with its tone', (state, color) => {
        const tree = render(<SlaChip state={state} label="Due in 2 h" testID="sla" />);
        const container = hostOf(tree, 'sla-container');
        expect(JSON.stringify(container.props.style)).toContain(color);
        expect(chipOf(tree, 'sla').props.accessibilityLabel).toBe('Due in 2 h');
    });
});
