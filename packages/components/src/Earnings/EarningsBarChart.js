import React from 'react';

import { StyleSheet, View } from 'react-native';

import { MD3LightTheme, Text, TouchableRipple } from '@jmstechnologiesinc/react-native-paper';

import { isEmptyRange, toBars } from './utils';

// The plot needs an explicit height for the bars to be sized as a percentage of it. Two spacing
// steps keep a week readable without pushing the breakdown below the fold on a small phone.
const PLOT_HEIGHT = MD3LightTheme.spacing.x15 * 2;

/**
 * Earnings per bucket, one bar each. Sizing and peak detection live in `utils.js`; this only
 * paints, so an empty week and a full one go down the same path.
 */
const EarningsBarChart = ({ buckets, selectedKey, onPress }) => {
    const bars = toBars(buckets);

    // A single bucket is not a chart. Its bar is always the peak, so it fills the plot edge to edge
    // and reads as a coloured block with nothing to compare it against — the figure above it
    // already says everything. This is what makes the "today" range show a total and no chart.
    if (bars.length < 2) {
        return null;
    }

    // Nothing earned: the bars are all stubs, and painting them in the accent colour would make a
    // blank week look like a full one.
    const isEmpty = isEmptyRange(buckets);

    return (
        <View style={styles.chart}>
            {bars.map((bar) => {
                // Highlight what the user picked; with no selection the peak is the useful default.
                const isHighlighted = !isEmpty && (selectedKey ? bar.key === selectedKey : bar.isPeak);

                return (
                    <TouchableRipple
                        key={bar.key}
                        style={styles.column}
                        disabled={!onPress}
                        onPress={onPress ? () => onPress(bar) : undefined}
                        accessibilityRole="button"
                        accessibilityLabel={`${bar.label} ${bar.formattedValue}`}
                        accessibilityState={{ selected: bar.key === selectedKey }}
                    >
                        <View>
                            <View style={styles.plot}>
                                <View
                                    style={[
                                        styles.bar,
                                        { height: `${bar.ratio * 100}%` },
                                        isEmpty && styles.barEmpty,
                                        isHighlighted && styles.barHighlighted,
                                    ]}
                                />
                            </View>

                            <Text variant="labelSmall" style={styles.label} numberOfLines={1}>
                                {bar.label}
                            </Text>
                        </View>
                    </TouchableRipple>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    // No horizontal padding: the host screen owns it through ScreenWrapper.Container.
    chart: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    column: {
        flex: 1,
        paddingVertical: MD3LightTheme.spacing.x2,
    },
    plot: {
        height: PLOT_HEIGHT,
        justifyContent: 'flex-end',
    },
    bar: {
        marginHorizontal: MD3LightTheme.spacing.x1,
        borderTopLeftRadius: MD3LightTheme.spacing.x1,
        borderTopRightRadius: MD3LightTheme.spacing.x1,
        backgroundColor: MD3LightTheme.colors.primaryContainer,
    },
    barHighlighted: {
        backgroundColor: MD3LightTheme.colors.primary,
    },
    barEmpty: {
        backgroundColor: MD3LightTheme.colors.surfaceDisabled,
    },
    label: {
        marginTop: MD3LightTheme.spacing.x1,
        textAlign: 'center',
        color: MD3LightTheme.colors.onSurfaceVariant,
    },
});

export default EarningsBarChart;
