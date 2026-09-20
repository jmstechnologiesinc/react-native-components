import React from 'react';
import { ScrollView, View } from 'react-native';

import { Divider, MD3Colors, MD3LightTheme, Text } from '@jmstechnologiesinc/react-native-paper';
import { CANONICAL_ORDER_STATUS as C } from '@jmstechnologiesinc/order';
import { TRANSITIONS, TERMINAL_STATES, PROGRESS_RAIL } from '@jmstechnologiesinc/order-narration';

// Canon §13, IN STORYBOOK. `Order.stories.js` and `OrderCells.stories.js`
// show what one cell of the narration renders; this file shows the graph
// those cells are cells OF. It reads `order-narration`'s tables directly —
// nothing here is drawn by hand, so a fact added to `src/graph.js` appears on
// the next reload. `scripts/graphViz.js` in that package renders the same
// tables as Mermaid and as an XState config for https://stately.ai/viz; this
// is the on-device and web view of it.
export default {
    title: 'packages/Order/graph',
};

const { spacing, colors } = MD3LightTheme;

const styles = {
    page: { padding: spacing.x4, backgroundColor: colors.background },
    state: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.x2,
        marginTop: spacing.x4,
        marginBottom: spacing.x2,
    },
    stateName: { fontFamily: 'monospace', fontWeight: '600' },
    tag: {
        paddingHorizontal: spacing.x2,
        paddingVertical: 2,
        borderRadius: spacing.x1,
        backgroundColor: colors.primaryContainer,
    },
    tagTerminal: { backgroundColor: MD3Colors.error90 },
    edge: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: spacing.x2,
        paddingVertical: 2,
        paddingLeft: spacing.x4,
    },
    fact: { fontFamily: 'monospace', color: colors.onSurfaceVariant, minWidth: 200 },
    next: { fontFamily: 'monospace', fontWeight: '600', color: colors.primary },
    stays: { fontFamily: 'monospace', color: colors.onSurfaceVariant },
    rail: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: spacing.x1, marginBottom: spacing.x4 },
    step: {
        fontFamily: 'monospace',
        paddingHorizontal: spacing.x2,
        paddingVertical: 2,
        borderRadius: spacing.x1,
        backgroundColor: colors.primaryContainer,
        color: colors.onPrimaryContainer,
    },
    arrow: { color: colors.onSurfaceVariant },
};

const isTerminal = (state) => TERMINAL_STATES.includes(state);

const StateHeading = ({ state }) => (
    <View style={styles.state}>
        <Text variant="titleMedium" style={styles.stateName}>
            {state}
        </Text>
        {isTerminal(state) ? (
            <View style={[styles.tag, styles.tagTerminal]}>
                <Text variant="labelSmall">terminal</Text>
            </View>
        ) : (
            <View style={styles.tag}>
                <Text variant="labelSmall">{`${Object.keys(TRANSITIONS[state]).length} facts`}</Text>
            </View>
        )}
    </View>
);

const Edges = ({ state }) => {
    const moves = Object.entries(TRANSITIONS[state]);
    if (moves.length === 0) {
        return (
            <View style={styles.edge}>
                <Text variant="bodyMedium" style={styles.stays}>
                    nothing leaves a terminal
                </Text>
            </View>
        );
    }
    return moves.map(([fact, next]) => (
        <View key={fact} style={styles.edge}>
            <Text variant="bodyMedium" style={styles.fact}>
                {fact}
            </Text>
            <Text variant="bodyMedium" style={styles.arrow}>
                →
            </Text>
            {next === state ? (
                <Text variant="bodyMedium" style={styles.stays}>
                    stays (projects nothing)
                </Text>
            ) : (
                <Text variant="bodyMedium" style={styles.next}>
                    {next}
                </Text>
            )}
        </View>
    ));
};

// ---------------------------------------------------------------------------
// The whole graph: every state, every fact it admits, where each one lands.
// A fact that maps to its own state is a self-transition — legal, but the
// order does not move (offer churn, the arrivals, the prep start).
// ---------------------------------------------------------------------------
export const Transitions = () => (
    <ScrollView contentContainerStyle={styles.page}>
        <Text variant="bodyMedium">
            {`${Object.keys(TRANSITIONS).length} states, ${TERMINAL_STATES.length} terminals. The entry state is ${
                C.placed
            }.`}
        </Text>
        {Object.keys(TRANSITIONS).map((state) => (
            <View key={state}>
                <StateHeading state={state} />
                <Edges state={state} />
                <Divider />
            </View>
        ))}
    </ScrollView>
);

// ---------------------------------------------------------------------------
// One state at a time, picked from the controls panel.
// ---------------------------------------------------------------------------
export const FromState = ({ status }) => (
    <ScrollView contentContainerStyle={styles.page}>
        <StateHeading state={status} />
        <Edges state={status} />
    </ScrollView>
);
FromState.args = { status: C.confirmed };
FromState.argTypes = { status: { control: 'select', options: Object.values(C) } };

// ---------------------------------------------------------------------------
// The line a customer is shown per vertical. Not the graph: a rail has no
// branches, and a terminal is never a step on one — an order that ended did
// not reach the end of the rail, it left it.
// ---------------------------------------------------------------------------
export const ProgressRails = () => (
    <ScrollView contentContainerStyle={styles.page}>
        {Object.entries(PROGRESS_RAIL).map(([vertical, steps]) => (
            <View key={vertical}>
                <Text variant="titleMedium" style={styles.stateName}>
                    {vertical}
                </Text>
                <View style={styles.rail}>
                    {steps.map((step, i) => (
                        <React.Fragment key={step}>
                            {i > 0 && (
                                <Text variant="bodyMedium" style={styles.arrow}>
                                    ›
                                </Text>
                            )}
                            <Text variant="bodyMedium" style={styles.step}>
                                {step}
                            </Text>
                        </React.Fragment>
                    ))}
                </View>
            </View>
        ))}
    </ScrollView>
);
