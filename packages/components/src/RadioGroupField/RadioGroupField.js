import React from 'react';
import { View } from 'react-native';

import { HelperText, RadioButton, Text, useTheme } from '@jmstechnologiesinc/react-native-paper';

/**
 * A labelled single choice: Paper `RadioButton.Group` of `RadioButton.Item` rows (the option's label, the
 * radio trailing, as Paper draws it), in a `radiogroup` named `label`. The options are whatever the host
 * lists; `error` is shown under them.
 *
 * On the web the items' checked state does not reach the DOM (see PROJECT.md, Paper fork web a11y items).
 *
 * @param {{label?: string, options: Array<{value: string, label: string, disabled?: boolean}>, value?: string,
 *     onChange: (value: string) => void, disabled?: boolean, error?: string, testID?: string}} props item
 *     testIDs `<testID>-<value>`; default `radio-group`
 */
const RadioGroupField = ({ label, options, value, onChange, disabled = false, error, testID = 'radio-group' }) => {
    const { colors, spacing } = useTheme();
    return (
        <View role="radiogroup" aria-label={label} testID={testID}>
            {label ? (
                <Text
                    variant="labelLarge"
                    style={{ color: colors.onSurfaceVariant, paddingHorizontal: spacing.x6, paddingTop: spacing.x2 }}
                >
                    {label}
                </Text>
            ) : null}
            <RadioButton.Group value={value ?? ''} onValueChange={onChange}>
                {options.map((option) => (
                    <RadioButton.Item
                        key={option.value}
                        value={option.value}
                        label={option.label}
                        disabled={disabled || Boolean(option.disabled)}
                        accessibilityLabel={option.label}
                        testID={`${testID}-${option.value}`}
                    />
                ))}
            </RadioButton.Group>
            {error ? (
                <HelperText type="error" visible testID={`${testID}-error`}>
                    {error}
                </HelperText>
            ) : null}
        </View>
    );
};

export default RadioGroupField;
