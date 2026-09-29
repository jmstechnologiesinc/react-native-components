import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Text, useTheme } from '@jmstechnologiesinc/react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { LabelChip } from '../Partner/StatusChip';
import ListRow from '../ListRow/ListRow';
import { localized } from '../Localization/Localization';

/**
 * A state machine drawn from data, for a reader that must see where an entity is and how it can move: the states as
 * nodes on a grid the host lays out (`row`, `column`), a connector between two neighbouring nodes that an edge joins
 * (its arrow says the direction; both ways, a two-headed arrow), then every transition as a list row — its event, the
 * states it joins, what it needs, and a chip of what the host knows of it (it happened, it is allowed now). The
 * component decides nothing: which state is current, which were reached and which transitions happened or are allowed
 * are the host's (the server's) answers.
 *
 * Responsive: where the measured width cannot give each column a node of `spacing.x20 + spacing.x10` (120dp) and
 * its connector, the grid is drawn transposed (the host's rows become columns: the way through reads down), and a
 * transition's chip goes under its text instead of beside it (MD3 lists: trailing content never squeezes the
 * headline).
 *
 * Accessibility: the diagram is a named list of states, the current one announced as the current step
 * (`aria-current="step"`, WAI-ARIA), a reached or final state said as such; the connectors are decoration (the
 * transitions list says the same in words). MD3: nodes are outlined containers on the theme's roles, the current one
 * on `secondaryContainer`; spacing on the theme's tokens.
 *
 * @param {{nodes: Array<{id: string, label: string, row: number, column: number, terminal?: boolean}>,
 *     edges: Array<{id: string, from: string, to: string, label: string, description?: string, icon?: string,
 *     status?: {label: string, tone?: string}}>, current?: string, reached?: string[], accessibilityLabel: string,
 *     transitionsLabel: string, testID?: string}} props testIDs `<testID>`, `<testID>-node-<id>`,
 *     `<testID>-edge-<id>`, `<testID>-transitions`
 */
const StateFlow = ({
    nodes,
    edges,
    current,
    reached = [],
    accessibilityLabel,
    transitionsLabel,
    testID = 'state-flow',
}) => {
    const theme = useTheme();
    const { colors, spacing } = theme;
    const [width, setWidth] = useState(null);
    const hostColumns = Math.max(0, ...nodes.map((node) => node.column)) + 1;
    const needed = hostColumns * (spacing.x20 + spacing.x10) + (hostColumns - 1) * spacing.x10;
    const compact = width !== null && width < needed;
    // The grid as drawn: the host's, or transposed on a narrow width.
    const placed = nodes.map((node) => (compact ? { ...node, row: node.column, column: node.row } : node));
    const rows = Math.max(0, ...placed.map((node) => node.row)) + 1;
    const columns = Math.max(0, ...placed.map((node) => node.column)) + 1;
    const at = (row, column) => placed.find((node) => node.row === row && node.column === column) ?? null;
    const byId = Object.fromEntries(nodes.map((node) => [node.id, node]));

    // How two neighbours are joined: forward (a → b), back (b → a), both, or not at all.
    const joined = (a, b) => {
        if (!a || !b) return null;
        const forward = edges.some((edge) => edge.from === a.id && edge.to === b.id);
        const back = edges.some((edge) => edge.from === b.id && edge.to === a.id);
        if (forward && back) return 'both';
        if (forward) return 'forward';
        return back ? 'back' : null;
    };
    const ARROW = {
        horizontal: { forward: 'arrow-right', back: 'arrow-left', both: 'swap-horizontal' },
        vertical: { forward: 'arrow-down', back: 'arrow-up', both: 'swap-vertical' },
    };
    const connector = (direction, join, key) => (
        <View
            key={key}
            style={direction === 'horizontal' ? { width: spacing.x10 } : styles.cell}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            aria-hidden
        >
            {join ? (
                <View style={styles.center}>
                    <MaterialCommunityIcons
                        name={ARROW[direction][join]}
                        size={spacing.x6}
                        color={colors.onSurfaceVariant}
                    />
                </View>
            ) : null}
        </View>
    );

    const stateNode = (node) => {
        const isCurrent = node.id === current;
        const wasReached = !isCurrent && reached.includes(node.id);
        const said = [
            node.label,
            isCurrent ? localized('global.stateCurrent') : null,
            wasReached ? localized('global.stateReached') : null,
            node.terminal ? localized('global.stateFinal') : null,
        ]
            .filter(Boolean)
            .join(', ');
        const icon = isCurrent ? 'map-marker' : wasReached ? 'check' : node.terminal ? 'flag-checkered' : null;
        const tint = isCurrent ? colors.onSecondaryContainer : colors.onSurfaceVariant;
        return (
            <View
                key={node.id}
                role="listitem"
                aria-current={isCurrent ? 'step' : undefined}
                accessible
                accessibilityLabel={said}
                style={[
                    styles.cell,
                    styles.node,
                    {
                        borderRadius: theme.roundness * 2,
                        borderColor: isCurrent ? colors.secondaryContainer : colors.outlineVariant,
                        backgroundColor: isCurrent ? colors.secondaryContainer : colors.surface,
                        paddingHorizontal: spacing.x4,
                        paddingVertical: spacing.x2,
                        gap: spacing.x2,
                    },
                ]}
                testID={`${testID}-node-${node.id}`}
            >
                {icon ? <MaterialCommunityIcons name={icon} size={spacing.x5} color={tint} /> : null}
                <Text
                    variant={isCurrent ? 'titleSmall' : 'labelLarge'}
                    numberOfLines={2}
                    style={[styles.label, { color: isCurrent ? colors.onSecondaryContainer : colors.onSurface }]}
                >
                    {node.label}
                </Text>
            </View>
        );
    };

    const statusChip = (status) => <LabelChip label={status.label} tone={status.tone} compact />;

    const gridRows = [];
    for (let row = 0; row < rows; row += 1) {
        const cells = [];
        for (let column = 0; column < columns; column += 1) {
            const node = at(row, column);
            cells.push(node ? stateNode(node) : <View key={`empty-${row}-${column}`} style={styles.cell} />);
            if (column < columns - 1) {
                cells.push(connector('horizontal', joined(node, at(row, column + 1)), `h-${row}-${column}`));
            }
        }
        gridRows.push(
            <View key={`row-${row}`} style={styles.row}>
                {cells}
            </View>
        );
        if (row < rows - 1) {
            const links = [];
            for (let column = 0; column < columns; column += 1) {
                links.push(connector('vertical', joined(at(row, column), at(row + 1, column)), `v-${row}-${column}`));
                if (column < columns - 1)
                    links.push(<View key={`vs-${row}-${column}`} style={{ width: spacing.x10 }} />);
            }
            gridRows.push(
                <View key={`links-${row}`} style={[styles.row, { height: spacing.x8 }]}>
                    {links}
                </View>
            );
        }
    }

    return (
        <View testID={testID} onLayout={(event) => setWidth(event.nativeEvent.layout.width)}>
            <View
                role="list"
                aria-label={accessibilityLabel}
                style={{ paddingVertical: spacing.x2 }}
                testID={`${testID}-${compact ? 'vertical' : 'horizontal'}`}
            >
                {gridRows}
            </View>
            <View role="list" aria-label={transitionsLabel} testID={`${testID}-transitions`}>
                {edges.map((edge) => (
                    <ListRow
                        key={edge.id}
                        title={edge.label}
                        description={[
                            `${byId[edge.from]?.label ?? edge.from} → ${byId[edge.to]?.label ?? edge.to}`,
                            edge.description,
                        ]
                            .filter(Boolean)
                            .join(' · ')}
                        icon={edge.icon}
                        inset={false}
                        trailing={edge.status && !compact ? statusChip(edge.status) : undefined}
                        details={
                            edge.status && compact ? (
                                <View style={{ marginTop: spacing.x2 }}>{statusChip(edge.status)}</View>
                            ) : undefined
                        }
                        testID={`${testID}-edge-${edge.id}`}
                    />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'stretch',
    },
    cell: {
        flex: 1,
        minWidth: 0,
    },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    // MD3 outlined container: a 1dp outline.
    node: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
    },
    label: {
        flexShrink: 1,
    },
});

export default StateFlow;
