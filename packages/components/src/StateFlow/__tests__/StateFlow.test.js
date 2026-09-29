jest.mock('react-native-localize', () => ({
    findBestLanguageTag: jest.fn(() => ({ languageTag: 'en', isRTL: false })),
}));

import React from 'react';
import renderer, { act } from 'react-test-renderer';

import { MD3LightTheme, Provider } from '@jmstechnologiesinc/react-native-paper';

import { setI18nConfig } from '../../Localization/Localization';
import StateFlow from '../StateFlow';

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

beforeAll(() => {
    setI18nConfig();
});

// The HOST nodes of a testID: what a screen reader reads.
const hostOf = (tree, testID) =>
    tree.root.findAll((node) => typeof node.type === 'string' && node.props.testID === testID)[0];
const iconsOf = (tree) =>
    tree.root
        .findAll((node) => typeof node.type !== 'string' && typeof node.props.name === 'string' && node.props.size)
        .map((node) => node.props.name);

// An order: placed → accepted ⇄ paused; placed ↓ rejected (final).
const NODES = [
    { id: 'placed', label: 'Placed', row: 0, column: 0 },
    { id: 'accepted', label: 'Accepted', row: 0, column: 1 },
    { id: 'paused', label: 'Paused', row: 0, column: 2 },
    { id: 'rejected', label: 'Rejected', row: 1, column: 0, terminal: true },
];
const EDGES = [
    { id: 'accept', from: 'placed', to: 'accepted', label: 'Accept', status: { label: 'Happened', tone: 'success' } },
    { id: 'pause', from: 'accepted', to: 'paused', label: 'Pause', description: 'A reason is needed' },
    { id: 'resume', from: 'paused', to: 'accepted', label: 'Resume', status: { label: 'Allowed now', tone: 'info' } },
    { id: 'reject', from: 'placed', to: 'rejected', label: 'Reject' },
];

const flow = (props = {}) =>
    render(
        <StateFlow
            nodes={NODES}
            edges={EDGES}
            current="paused"
            reached={['placed', 'accepted']}
            accessibilityLabel="Order states"
            transitionsLabel="Transitions"
            testID="flow"
            {...props}
        />
    );

describe('StateFlow', () => {
    it('names every state, the current one as the current step, a reached or final one as such', () => {
        const tree = flow();

        const current = hostOf(tree, 'flow-node-paused');
        expect(current.props.accessibilityLabel).toBe('Paused, current state');
        expect(current.props['aria-current']).toBe('step');
        expect(hostOf(tree, 'flow-node-accepted').props.accessibilityLabel).toBe('Accepted, reached before');
        expect(hostOf(tree, 'flow-node-accepted').props['aria-current']).toBeUndefined();
        expect(hostOf(tree, 'flow-node-rejected').props.accessibilityLabel).toBe('Rejected, final state');
    });

    it('joins neighbours by their edges: one way, both ways, and down to the next row', () => {
        const icons = iconsOf(flow());

        // placed → accepted, accepted ⇄ paused, placed ↓ rejected; the current, reached and final markers.
        expect(icons).toEqual(
            expect.arrayContaining([
                'arrow-right',
                'swap-horizontal',
                'arrow-down',
                'map-marker',
                'check',
                'flag-checkered',
            ])
        );
        expect(icons).not.toContain('arrow-left');
    });

    it('lists every transition with the states it joins, what it needs and the host’s chip', () => {
        const tree = flow();
        const text = (testID) =>
            hostOf(tree, testID)
                .findAll((node) => typeof node.type === 'string' && typeof node.props.children === 'string')
                .map((node) => node.props.children)
                .join(' | ');

        expect(text('flow-edge-accept')).toContain('Placed → Accepted');
        expect(text('flow-edge-accept')).toContain('Happened');
        expect(text('flow-edge-pause')).toContain('Accepted → Paused · A reason is needed');
        expect(text('flow-edge-resume')).toContain('Allowed now');
        expect(hostOf(tree, 'flow-transitions').props['aria-label']).toBe('Transitions');
    });

    it('hides the connectors from assistive technology: the transitions say the same in words', () => {
        const tree = flow();
        const hidden = tree.root.findAll(
            (node) => typeof node.type === 'string' && node.props.importantForAccessibility === 'no-hide-descendants'
        );
        expect(hidden.length).toBeGreaterThan(0);
    });
});

describe('StateFlow on a narrow width', () => {
    const layout = (tree, width) =>
        act(() => {
            hostOf(tree, 'flow').props.onLayout({ nativeEvent: { layout: { width, height: 400 } } });
        });

    it('draws the way through down the page, and the chips under the transitions’ text', () => {
        const tree = flow();
        expect(hostOf(tree, 'flow-horizontal')).toBeTruthy();

        layout(tree, 320);

        expect(hostOf(tree, 'flow-vertical')).toBeTruthy();
        // placed ↓ accepted ⇅ paused; placed → rejected (the host's rows became columns).
        expect(iconsOf(tree)).toEqual(expect.arrayContaining(['arrow-down', 'swap-vertical', 'arrow-right']));
    });

    it('keeps the host’s grid where every column fits', () => {
        const tree = flow();
        layout(tree, 1200);
        expect(hostOf(tree, 'flow-horizontal')).toBeTruthy();
    });
});
