import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '@jmstechnologiesinc/react-native-paper';

/**
 * A wrapping row of chips with MD3's gap between them (8dp, `spacing.x2`, in both directions). The row
 * owns the spacing so every chip row of a host reads the same; a host never sets a chip gap itself.
 *
 * - `accessibilityLabel` makes the row a named `list` and wraps each chip in a `listitem` (a set of
 *   values: roles, trip classes); without it the row is plain layout (a status beside its SLA).
 * - `align` `end` right-aligns the chips (a header's badges).
 *
 * @param {{children?: React.ReactNode, accessibilityLabel?: string, align?: 'start'|'end', style?: any,
 *     testID?: string}} props
 */
const ChipRow = ({ children, accessibilityLabel, align = 'start', style, testID }) => {
    const { spacing } = useTheme();
    const list = Boolean(accessibilityLabel);
    return (
        <View
            role={list ? 'list' : undefined}
            aria-label={accessibilityLabel}
            style={[styles.row, align === 'end' && styles.end, { gap: spacing.x2 }, style]}
            testID={testID}
        >
            {list
                ? React.Children.map(children, (child) =>
                      child ? (
                          <View role="listitem" key={child.key ?? undefined}>
                              {child}
                          </View>
                      ) : null
                  )
                : children}
        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
    },
    end: {
        justifyContent: 'flex-end',
    },
});

export default ChipRow;
