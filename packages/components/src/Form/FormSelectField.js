import React, { useState } from 'react';
import { Pressable, View } from 'react-native';

import { Menu, TextInput } from '@jmstechnologiesinc/react-native-paper';

import FormField from './FormField';

/**
 * A form field whose value is picked from the host's options (C-22): the outlined input the other fields use,
 * opening a Paper `Menu` (portable, so the console renders it on the web too). The options are the host's — the
 * catalogue, the package's vocabulary — and choosing one only reports it; nothing is validated here (K-32).
 *
 * `displayValue` is shown when `value` is not among the options (a stored make the current catalogue slice no
 * longer lists), so a vehicle is never shown blank for it.
 *
 * @param {{label: string, value?: string, displayValue?: string, options: Array<{value: string, label: string}>,
 *     onSelect: (option: {value: string, label: string}) => void, disabled?: boolean, highlighted?: boolean,
 *     field?: string, errors?: Array<{field: string, code: string, message?: string}>, testID?: string}} props
 *     option testIDs `<testID>.<value>`
 */
const FormSelectField = ({
    label,
    value,
    displayValue,
    options,
    onSelect,
    disabled = false,
    highlighted = false,
    field,
    errors,
    testID,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const selected = options.find((option) => option.value === value);

    const choose = (option) => {
        setIsOpen(false);
        onSelect(option);
    };

    return (
        <Menu
            visible={isOpen && !disabled}
            onDismiss={() => setIsOpen(false)}
            anchor={
                <Pressable
                    onPress={() => setIsOpen(true)}
                    disabled={disabled}
                    accessibilityRole="button"
                    accessibilityLabel={label}
                    accessibilityState={{ disabled, expanded: isOpen }}
                    testID={testID}
                >
                    {/* The input only draws the field; the press belongs to the whole row. */}
                    <View pointerEvents="none">
                        <FormField
                            mode="outlined"
                            field={field}
                            errors={errors}
                            highlighted={highlighted}
                            disabled={disabled}
                            editable={false}
                            label={label}
                            value={selected?.label ?? displayValue ?? ''}
                            right={disabled ? undefined : <TextInput.Icon icon="menu-down" />}
                        />
                    </View>
                </Pressable>
            }
        >
            {options.map((option) => (
                <Menu.Item
                    key={option.value}
                    title={option.label}
                    onPress={() => choose(option)}
                    testID={testID ? `${testID}.${option.value}` : undefined}
                />
            ))}
        </Menu>
    );
};

export default FormSelectField;
