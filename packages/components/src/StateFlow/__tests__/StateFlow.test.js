jest.mock('react-native-localize', () => ({
    findBestLanguageTag: jest.fn(() => ({ languageTag: 'en', isRTL: false })),
}));

import React from 'react';
import renderer, { act } from 'react-test-renderer';

import { MD3LightTheme, Provider } from '@jmstechnologiesinc/react-native-paper';

import { setI18nConfig } from '../../Localization/Localization';
import StateFlow from '../StateFlow';
import { stateFlowLayout } from '../stateFlowLayout';

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
const allWith = (tree, testID) => tree.root.findAll((node) => node.props.testID === testID);

// An order: placed → accepted, accepted → paused twice (by staff, by the system), paused → accepted; placed ↓
// rejected (final).
const NODES = [
    { id: 'placed', label: 'Placed', row: 0, column: 0 },
    { id: 'accepted', label: 'Accepted', row: 0, column: 1 },
    { id: 'paused', label: 'Paused', row: 0, column: 2 },
    { id: 'rejected', label: 'Rejected', row: 1, column: 0, terminal: true },
];
const EDGES = [
    {
        id: 'accept',
        from: 'placed',
        to: 'accepted',
        label: 'Accept',
        emphasis: 'taken',
        status: { label: 'Happened', tone: 'success' },
    },
    { id: 'pause', from: 'accepted', to: 'paused', label: 'Pause', description: 'A reason is needed' },
    { id: 'hold', from: 'accepted', to: 'paused', label: 'Hold' },
    {
        id: 'resume',
        from: 'paused',
        to: 'accepted',
        label: 'Resume',
        emphasis: 'available',
        status: { label: 'Allowed now', tone: 'info' },
    },
    { id: 'reject', from: 'placed', to: 'rejected', label: 'Reject' },
];
const SPACING = MD3LightTheme.spacing;
const FONT = MD3LightTheme.fonts.labelSmall.fontSize;

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
const measure = (tree, width) =>
    act(() => {
        hostOf(tree, 'flow-drawing').props.onLayout({ nativeEvent: { layout: { width, height: 400 } } });
    });

describe('stateFlowLayout: every edge drawn, none on a node', () => {
    const layout = (width = 1200, nodes = NODES) =>
        stateFlowLayout({ nodes, edges: EDGES, width, spacing: SPACING, fontSize: FONT });
    const drawnOf = (result, id) => result.edges.find((edge) => edge.id === id);

    it('draws every edge, parallel ones in lanes of their own', () => {
        const result = layout();
        expect(result.edges.map((edge) => edge.id)).toEqual(['accept', 'pause', 'hold', 'resume', 'reject']);
        // Accepted → paused twice: two arcs above the row, the second one lane further out.
        const top = result.boxes.accepted.y;
        expect(drawnOf(result, 'pause').label.y).toBeLessThan(top);
        expect(drawnOf(result, 'hold').label.y).toBeLessThan(drawnOf(result, 'pause').label.y);
        // Paused → accepted goes back below the row.
        expect(drawnOf(result, 'resume').label.y).toBeGreaterThan(top + result.boxes.accepted.height);
        // One edge between neighbours of a column: a straight line down.
        expect(drawnOf(result, 'reject').path).toMatch(/^M [\d.]+ [\d.]+ L /);
        expect(drawnOf(result, 'accept').path).toMatch(/ C /);
    });

    it('keeps the height whatever the width, and the nodes inside it', () => {
        const wide = layout(1200);
        expect(layout(800).height).toBe(wide.height);
        expect(layout(null)).toEqual({ height: wide.height, width: 0, boxes: {}, edges: [] });
        Object.values(wide.boxes).forEach((box) => {
            expect(box.x).toBeGreaterThanOrEqual(0);
            expect(box.x + box.width).toBeLessThanOrEqual(1200);
            expect(box.y + box.height).toBeLessThanOrEqual(wide.height);
        });
    });

    it('never sets a label on a node', () => {
        const result = layout();
        const inside = ({ x, y }, box) => x > box.x && x < box.x + box.width && y > box.y && y < box.y + box.height;
        result.edges.forEach((edge) =>
            Object.values(result.boxes).forEach((box) => expect(inside(edge.label, box)).toBe(false))
        );
    });
});

describe('StateFlow', () => {
    it('names every state, the current one as the current step, a reached or final one as such', () => {
        const tree = flow();
        measure(tree, 1200);

        const current = hostOf(tree, 'flow-node-paused');
        expect(current.props.accessibilityLabel).toBe('Paused, current state');
        expect(current.props['aria-current']).toBe('step');
        expect(hostOf(tree, 'flow-node-accepted').props.accessibilityLabel).toBe('Accepted, reached before');
        expect(hostOf(tree, 'flow-node-accepted').props['aria-current']).toBeUndefined();
        expect(hostOf(tree, 'flow-node-rejected').props.accessibilityLabel).toBe('Rejected, final state');
    });

    it('draws each edge in the primary colour when the host emphasises it, dashed while only allowed', () => {
        const tree = flow();
        measure(tree, 1200);

        const [taken] = allWith(tree, 'flow-arc-accept');
        const [allowed] = allWith(tree, 'flow-arc-resume');
        const [plain] = allWith(tree, 'flow-arc-pause');
        expect(taken.props.stroke).toBe(MD3LightTheme.colors.primary);
        expect(taken.props.strokeDasharray).toBeUndefined();
        expect(allowed.props.stroke).toBe(MD3LightTheme.colors.primary);
        expect(allowed.props.strokeDasharray).toBeDefined();
        expect(plain.props.stroke).toBe(MD3LightTheme.colors.outline);
    });

    it('lists every transition with the states it joins, what it needs and the host’s chip', () => {
        const tree = flow();
        measure(tree, 1200);
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

    it('hides the drawing from assistive technology: the transitions say the same in words', () => {
        const tree = flow();
        measure(tree, 1200);
        const hidden = tree.root.findAll(
            (node) => typeof node.type === 'string' && node.props.importantForAccessibility === 'no-hide-descendants'
        );
        // Every drawn edge sits inside a hidden subtree.
        const arcs = allWith(tree, 'flow-arc-accept');
        expect(arcs.length).toBeGreaterThan(0);
        expect(hidden.some((node) => node.findAll((inner) => inner.props.testID === 'flow-arc-accept').length)).toBe(
            true
        );
    });

    it('draws from the window’s width until it is measured, and keeps its height, so nothing below moves', () => {
        const tree = flow();
        const before = hostOf(tree, 'flow-drawing').props.style.height;
        expect(before).toBeGreaterThan(0);
        expect(hostOf(tree, 'flow-node-placed')).toBeTruthy();
        expect(allWith(tree, 'flow-arc-accept').length).toBeGreaterThan(0);

        measure(tree, 1200);
        expect(hostOf(tree, 'flow-drawing').props.style.height).toBe(before);
    });
});

describe('StateFlow on a narrow width', () => {
    it('keeps its drawing and its height, and scrolls it sideways in place', () => {
        const tree = flow();
        measure(tree, 1200);
        const wide = hostOf(tree, 'flow-drawing').props.style.height;
        expect(hostOf(tree, 'flow-fits')).toBeTruthy();

        measure(tree, 320);

        expect(hostOf(tree, 'flow-scrolls')).toBeTruthy();
        expect(hostOf(tree, 'flow-drawing').props.style.height).toBe(wide);
        // Every node keeps a width a label fits in.
        const width = (id) =>
            hostOf(tree, `flow-node-${id}`).props.style.find((style) => style && 'width' in style).width;
        expect(width('placed')).toBeGreaterThanOrEqual(SPACING.x20 + SPACING.x10);
    });

    it('widens the drawing past a narrow width instead of squeezing the nodes', () => {
        const result = stateFlowLayout({ nodes: NODES, edges: EDGES, width: 320, spacing: SPACING, fontSize: FONT });
        expect(result.width).toBeGreaterThan(320);
        Object.values(result.boxes).forEach((box) => expect(box.x + box.width).toBeLessThanOrEqual(result.width));
    });
});
