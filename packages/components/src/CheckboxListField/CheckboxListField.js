import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Checkbox, HelperText, Text, useTheme } from '@jmstechnologiesinc/react-native-paper';

import CheckedRow from '../ListRow/CheckedRow';

/**
 * A labelled multiple choice: one Paper `Checkbox.Item` per option (the Android checkbox leading its
 * label), in a `group` named `label`. It keeps nothing: `values` are the ticked options and `onChange`
 * gets the next list (in the order ticked). `disabled` greys the checkboxes out; `error` is shown under
 * them.
 *
 * `readOnly` shows the choice instead of asking it: every option as a `CheckedRow` in a `list` inside
 * the same `group` named `label`, the chosen ones with a check and announced «<label>, selected»,
 * nothing pressable and nothing greyed out. With `disabled` as well it is the disabled list, exactly.
 *
 * On the web the items' checked state does not reach the DOM (see PROJECT.md, Paper fork web a11y items).
 *
 * @param {{label?: string, options: Array<{value: string, label: string, disabled?: boolean}>,
 *     values: string[], onChange: (values: string[]) => void, disabled?: boolean, readOnly?: boolean,
 *     error?: string, testID?: string}} props item (or row) testIDs `<testID>-<value>`; default
 *     `checkbox-list`
 */
const CheckboxListField = ({
    label,
    options,
    values = [],
    onChange,
    disabled = false,
    readOnly = false,
    error,
    testID = 'checkbox-list',
}) => {
    const { colors, spacing } = useTheme();
    const selected = new Set(values);
    const toggle = (value) =>
        onChange?.(selected.has(value) ? values.filter((candidate) => candidate !== value) : [...values, value]);

    return (
        <View role="group" aria-label={label} testID={testID}>
            {label ? (
                <Text variant="labelLarge" style={{ color: colors.onSurfaceVariant, paddingVertical: spacing.x2 }}>
                    {label}
                </Text>
            ) : null}
            {readOnly && !disabled ? (
                // The group already carries `label`; naming the list too would announce it twice.
                <View role="list">
                    {options.map((option) => (
                        <CheckedRow
                            key={option.value}
                            title={option.label}
                            checked={selected.has(option.value)}
                            // An option's label is read whole, as its checkbox showed it.
                            titleNumberOfLines={0}
                            testID={`${testID}-${option.value}`}
                        />
                    ))}
                </View>
            ) : (
                options.map((option) => (
                    <Checkbox.Item
                        key={option.value}
                        mode="android"
                        position="leading"
                        label={option.label}
                        status={selected.has(option.value) ? 'checked' : 'unchecked'}
                        disabled={disabled || Boolean(option.disabled)}
                        onPress={() => toggle(option.value)}
                        labelStyle={styles.label}
                        style={styles.item}
                        testID={`${testID}-${option.value}`}
                    />
                ))
            )}
            {error ? (
                <HelperText type="error" visible padding="none" testID={`${testID}-error`}>
                    {error}
                </HelperText>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    item: {
        paddingHorizontal: 0,
    },
    label: {
        textAlign: 'left',
    },
});

export default CheckboxListField;
