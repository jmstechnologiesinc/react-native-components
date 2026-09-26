import React from 'react';
import { Platform, ScrollView, StyleSheet } from 'react-native';

import { Surface, Text, useTheme } from '@jmstechnologiesinc/react-native-paper';

// The MD3 type scale has no code role: each platform's own monospace face.
const MONOSPACE = Platform.select({
    web: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
    ios: 'Menlo',
    default: 'monospace',
});

/** `value` as text: a string as given, anything else as indented JSON. */
export const codeText = (value) => (typeof value === 'string' ? value : JSON.stringify(value, null, 2) ?? '');

/**
 * Read-only, selectable, monospace text on a `surfaceVariant` well: a JSON result, a rule expression. Long
 * lines scroll horizontally instead of widening the pane. `accessibilityLabel` names the block (a
 * `group`); the code itself stays the text a screen reader reads.
 *
 * @param {{value: *, accessibilityLabel?: string, testID?: string}} props testIDs `<testID>` (the text),
 *     `<testID>-container`; default `code-block`
 */
const CodeBlock = ({ value, accessibilityLabel, testID = 'code-block' }) => {
    const { colors, roundness, spacing } = useTheme();
    return (
        <Surface
            mode="flat"
            elevation={0}
            role={accessibilityLabel ? 'group' : undefined}
            aria-label={accessibilityLabel}
            style={{ backgroundColor: colors.surfaceVariant, borderRadius: roundness * 2, padding: spacing.x3 }}
            testID={`${testID}-container`}
        >
            <ScrollView horizontal>
                <Text
                    variant="bodySmall"
                    selectable
                    style={[styles.code, { color: colors.onSurfaceVariant }]}
                    testID={testID}
                >
                    {codeText(value)}
                </Text>
            </ScrollView>
        </Surface>
    );
};

const styles = StyleSheet.create({
    code: {
        fontFamily: MONOSPACE,
    },
});

export default CodeBlock;
