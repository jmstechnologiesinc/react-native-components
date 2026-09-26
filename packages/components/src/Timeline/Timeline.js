import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Avatar, Text, useTheme } from '@jmstechnologiesinc/react-native-paper';
import { moderateScale } from '@jmstechnologiesinc/react-native-size-matters';

import { localized } from '../Localization/Localization';
import { formatDateTime } from '../Localization/format';
import { toneColors } from '../tones';

const MARKER_SIZE = moderateScale(24);
const DOT_SIZE = moderateScale(10);
const RAIL_WIDTH = moderateScale(2);

export const TIMELINE_VARIANTS = Object.freeze({ history: 'history', steps: 'steps' });

export const STEP_STATES = Object.freeze({ done: 'done', current: 'current', upcoming: 'upcoming' });

const stepStateOf = (index, activeIndex) =>
    index < activeIndex ? STEP_STATES.done : index === activeIndex ? STEP_STATES.current : STEP_STATES.upcoming;

const STEP_STATE_LABEL_KEY = {
    [STEP_STATES.done]: 'global.stepDone',
    [STEP_STATES.current]: 'global.stepCurrent',
    [STEP_STATES.upcoming]: 'global.stepUpcoming',
};

const HistoryMarker = ({ item, theme }) => {
    const colors = toneColors(theme, item.tone);
    return item.icon ? (
        <Avatar.Icon
            icon={item.icon}
            size={MARKER_SIZE}
            color={colors.onContainer}
            style={{ backgroundColor: colors.container }}
        />
    ) : (
        <View style={[styles.dot, { backgroundColor: colors.accent }]} />
    );
};

const StepMarker = ({ index, state, theme }) => {
    if (state === STEP_STATES.done) {
        return (
            <Avatar.Icon
                icon="check"
                size={MARKER_SIZE}
                color={theme.colors.onPrimary}
                style={{ backgroundColor: theme.colors.primary }}
            />
        );
    }
    const current = state === STEP_STATES.current;
    return (
        <Avatar.Text
            label={String(index + 1)}
            size={MARKER_SIZE}
            color={current ? theme.colors.onPrimary : theme.colors.onSurfaceVariant}
            style={{ backgroundColor: current ? theme.colors.primary : theme.colors.surfaceVariant }}
        />
    );
};

/**
 * A vertical sequence of events or steps.
 *
 * - `history`: what happened, in the order given; each item may carry a `tone`
 *   (`success | warning | danger | neutral | info`) and an `icon`, and `at` (an
 *   instant) is formatted in the app's locale.
 * - `steps`: a process; items before `activeIndex` are done, the one at it is
 *   current, the rest are upcoming.
 */
const Timeline = ({ items = [], variant = TIMELINE_VARIANTS.history, activeIndex = 0, testID }) => {
    const theme = useTheme();
    const isSteps = variant === TIMELINE_VARIANTS.steps;

    return (
        <View accessibilityRole="list" testID={testID}>
            {items.map((item, index) => {
                const isLast = index === items.length - 1;
                const state = isSteps ? stepStateOf(index, activeIndex) : null;
                const upcoming = state === STEP_STATES.upcoming;
                const at = item.at ? formatDateTime(item.at) : null;
                const accessibilityLabel = [
                    isSteps ? localized('global.stepOf', { step: index + 1, count: items.length }) : null,
                    item.title,
                    isSteps ? localized(STEP_STATE_LABEL_KEY[state]) : null,
                    item.description,
                    at,
                ]
                    .filter(Boolean)
                    .join(', ');

                return (
                    <View
                        key={item.id ?? index}
                        style={styles.row}
                        accessible
                        accessibilityLabel={accessibilityLabel}
                        accessibilityState={isSteps ? { selected: state === STEP_STATES.current } : undefined}
                        testID={testID ? `${testID}-item-${index}` : undefined}
                    >
                        <View style={styles.rail}>
                            <View style={styles.marker}>
                                {isSteps ? (
                                    <StepMarker index={index} state={state} theme={theme} />
                                ) : (
                                    <HistoryMarker item={item} theme={theme} />
                                )}
                            </View>
                            {isLast ? null : (
                                <View
                                    style={[
                                        styles.line,
                                        {
                                            backgroundColor:
                                                state === STEP_STATES.done
                                                    ? theme.colors.primary
                                                    : theme.colors.outlineVariant,
                                        },
                                    ]}
                                />
                            )}
                        </View>
                        <View
                            style={[
                                styles.content,
                                { paddingLeft: theme.spacing.x4, paddingBottom: isLast ? 0 : theme.spacing.x4 },
                            ]}
                        >
                            <Text
                                variant={state === STEP_STATES.current ? 'titleSmall' : 'bodyLarge'}
                                style={{ color: upcoming ? theme.colors.onSurfaceVariant : theme.colors.onSurface }}
                            >
                                {item.title}
                            </Text>
                            {item.description ? (
                                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                                    {item.description}
                                </Text>
                            ) : null}
                            {at ? (
                                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                                    {at}
                                </Text>
                            ) : null}
                        </View>
                    </View>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
    },
    rail: {
        width: MARKER_SIZE,
        alignItems: 'center',
    },
    marker: {
        width: MARKER_SIZE,
        height: MARKER_SIZE,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dot: {
        width: DOT_SIZE,
        height: DOT_SIZE,
        borderRadius: DOT_SIZE / 2,
    },
    line: {
        flex: 1,
        width: RAIL_WIDTH,
    },
    content: {
        flex: 1,
        minHeight: MARKER_SIZE,
    },
});

export default Timeline;
