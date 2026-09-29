import React, { useState } from 'react';
import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import Svg, { Path, Text as SvgText } from 'react-native-svg';

import { Text, useTheme } from '@jmstechnologiesinc/react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { LabelChip } from '../Partner/StatusChip';
import ListRow from '../ListRow/ListRow';
import { localized } from '../Localization/Localization';

import { stateFlowLayout } from './stateFlowLayout';

/**
 * A state machine drawn from data, for a reader that must see where an entity is and how it can move: the states as
 * nodes on a grid the host lays out (`row`, `column`), every edge drawn in SVG (`react-native-svg`) with its arrow and
 * its event's label (arcs between states of a row, above going right and below going left, one lane per parallel
 * edge; a straight line between neighbours of a column; `stateFlowLayout`), an edge the host emphasises in the
 * theme's primary colour (`taken`, solid; `available`, dashed), then every transition as a list row — its event, the
 * states it joins, what it needs, and a chip of what the host knows of it (it happened, it is allowed now). The
 * component decides nothing: which state is current, which were reached and which transitions happened or are allowed
 * are the host's (the server's) answers. The drawing's height does not depend on the width, so measuring it moves
 * nothing below.
 *
 * Responsive without a jump: the drawing's height never depends on the width, and where the measured width cannot
 * give each node `spacing.x20 + spacing.x10` (120dp) the drawing keeps that width and scrolls sideways in place (a
 * transposed drawing would change the height once measured, moving everything below). A transition's chip sits under
 * its text at every width (MD3 lists: supporting content; a trailing chip squeezes the headline on a narrow width,
 * and moving it there would change the row's height).
 *
 * Accessibility: the diagram is a named list of states, the current one announced as the current step
 * (`aria-current="step"`, WAI-ARIA), a reached or final state said as such; the drawn edges are decoration (the
 * transitions list says the same in words). MD3: nodes are outlined containers on the theme's roles, the current one
 * on `secondaryContainer`; spacing on the theme's tokens.
 *
 * @param {{nodes: Array<{id: string, label: string, row: number, column: number, terminal?: boolean}>,
 *     edges: Array<{id: string, from: string, to: string, label: string, description?: string, icon?: string,
 *     emphasis?: 'taken' | 'available', status?: {label: string, tone?: string}}>, current?: string, reached?: string[], accessibilityLabel: string,
 *     transitionsLabel: string, testID?: string}} props testIDs `<testID>`, `<testID>-node-<id>`,
 *     `<testID>-edge-<id>` (the transition's row), `<testID>-arc-<id>` (its drawing), `<testID>-transitions`
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
    const { colors, fonts, spacing } = theme;
    const [measured, setMeasured] = useState(null);
    // Until the drawing is measured, the window's width stands in, so the states are drawn (and announced) from the
    // first render; the height never depends on the width, so the measurement moves nothing below.
    const window = useWindowDimensions();
    const available = measured ?? window.width;
    const labelFont = fonts.labelSmall;
    const layout = stateFlowLayout({ nodes, edges, width: available, spacing, fontSize: labelFont.fontSize });
    const scrolls = layout.width > available;
    const byId = Object.fromEntries(nodes.map((node) => [node.id, node]));
    const emphasisOf = Object.fromEntries(edges.map((edge) => [edge.id, edge.emphasis]));
    const labelOf = Object.fromEntries(edges.map((edge) => [edge.id, edge.label]));

    const stroke = (emphasis) => (emphasis ? colors.primary : colors.outline);
    const statusChip = (status) => (
        <View style={{ marginTop: spacing.x2 }}>
            <LabelChip label={status.label} tone={status.tone} compact />
        </View>
    );

    const stateNode = (node) => {
        const box = layout.boxes[node.id];
        if (!box) return null;
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
                    styles.node,
                    {
                        left: box.x,
                        top: box.y,
                        width: box.width,
                        height: box.height,
                        borderRadius: theme.roundness * 2,
                        borderColor: isCurrent ? colors.secondaryContainer : colors.outlineVariant,
                        backgroundColor: isCurrent ? colors.secondaryContainer : colors.surface,
                        paddingHorizontal: spacing.x4,
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

    return (
        <View testID={testID}>
            <View
                onLayout={(event) => setMeasured(event.nativeEvent.layout.width)}
                style={{ height: layout.height }}
                testID={`${testID}-drawing`}
            >
                <ScrollView
                    horizontal
                    scrollEnabled={scrolls}
                    showsHorizontalScrollIndicator={scrolls}
                    contentContainerStyle={{ width: layout.width, height: layout.height }}
                    testID={`${testID}-${scrolls ? 'scrolls' : 'fits'}`}
                >
                    {layout.edges.length ? (
                        <View
                            style={StyleSheet.absoluteFill}
                            pointerEvents="none"
                            accessibilityElementsHidden
                            importantForAccessibility="no-hide-descendants"
                            aria-hidden
                        >
                            <Svg width={layout.width} height={layout.height}>
                                {layout.edges.map((drawn) => {
                                    const emphasis = emphasisOf[drawn.id];
                                    const color = stroke(emphasis);
                                    // MD3 outline weight: 1dp; an emphasised edge 2dp, dashed while it is only allowed.
                                    const weight = emphasis ? 2 : 1;
                                    return (
                                        <React.Fragment key={drawn.id}>
                                            <Path
                                                d={drawn.path}
                                                stroke={color}
                                                strokeWidth={weight}
                                                strokeDasharray={
                                                    emphasis === 'available' ? `${spacing.x1} ${spacing.x1}` : undefined
                                                }
                                                fill="none"
                                                testID={`${testID}-arc-${drawn.id}`}
                                            />
                                            <Path d={drawn.arrow} fill={color} />
                                            <SvgText
                                                x={drawn.label.x}
                                                y={drawn.label.y}
                                                textAnchor={drawn.label.anchor}
                                                fontSize={labelFont.fontSize}
                                                fontFamily={labelFont.fontFamily}
                                                fontWeight={labelFont.fontWeight}
                                                fill={emphasis ? colors.primary : colors.onSurfaceVariant}
                                            >
                                                {labelOf[drawn.id] ?? ''}
                                            </SvgText>
                                        </React.Fragment>
                                    );
                                })}
                            </Svg>
                        </View>
                    ) : null}
                    <View role="list" aria-label={accessibilityLabel} style={StyleSheet.absoluteFill}>
                        {nodes.map(stateNode)}
                    </View>
                </ScrollView>
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
                        details={edge.status ? statusChip(edge.status) : undefined}
                        testID={`${testID}-edge-${edge.id}`}
                    />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    // MD3 outlined container: a 1dp outline; placed where the layout puts it.
    node: {
        position: 'absolute',
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
    },
    label: {
        flexShrink: 1,
    },
});

export default StateFlow;
