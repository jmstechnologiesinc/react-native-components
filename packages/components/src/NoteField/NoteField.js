import React from 'react';
import { View } from 'react-native';

import { HelperText, TextInput } from '@jmstechnologiesinc/react-native-paper';

import { isWeb } from '../accessibility';

/**
 * An outlined text field (multi-line by default) with its helper or error line (MD3): a Paper `TextInput
 * mode="outlined"` and a `HelperText`. `required` marks the label (`<label> *`) and, on the web, the input
 * (`aria-required`); whether the value is acceptable is the host's (the server's) to say: this only shows
 * the `error` it is given.
 *
 * @param {{label: string, value: string, onChangeText: (text: string) => void, helper?: string,
 *     error?: string, required?: boolean, multiline?: boolean, numberOfLines?: number, disabled?: boolean,
 *     testID?: string}} props testIDs `<testID>` (the input), `<testID>-helper`; default `note-field`
 */
const NoteField = ({
    label,
    value,
    onChangeText,
    helper,
    error,
    required = false,
    multiline = true,
    numberOfLines,
    disabled = false,
    testID = 'note-field',
}) => (
    <View>
        <TextInput
            mode="outlined"
            label={required ? `${label} *` : label}
            value={value}
            onChangeText={onChangeText}
            multiline={multiline}
            numberOfLines={numberOfLines ?? (multiline ? 3 : 1)}
            error={Boolean(error)}
            disabled={disabled}
            accessibilityLabel={label}
            {...(isWeb() && { 'aria-required': required })}
            testID={testID}
        />
        <HelperText type={error ? 'error' : 'info'} visible={Boolean(error || helper)} testID={`${testID}-helper`}>
            {error || helper}
        </HelperText>
    </View>
);

export default NoteField;
