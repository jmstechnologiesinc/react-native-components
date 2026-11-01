import React, { useState } from 'react';
import { TextInput } from '@jmstechnologiesinc/react-native-paper';

// The «show» toggle is an entry aid for whoever types the secret: a disabled
// input never offered it, and `readOnly` (optional; the partner console, through
// `FormField`) shows the secret read-only — `editable={false}` and `readOnly` on
// the input — and masked, with no toggle. `editable={false}` alone keeps the
// toggle, as it always had.
const SecretInputText = ({ label, value, onChangeText, disabled, readOnly = false, mode, ...rest }) => {
    const [isTextSecureEntry, setIsTextSecureEntry] = useState(true);
    const canReveal = !disabled && !readOnly;

    return (
        <TextInput
            label={label}
            value={value}
            onChangeText={onChangeText}
            disabled={disabled}
            mode={mode}
            secureTextEntry={isTextSecureEntry}
            // A secret is compared byte for byte and nobody normalizes it, so a
            // capital injected by the keyboard silently changes the value.
            autoCapitalize="none"
            autoCorrect={false}
            {...rest}
            {...(readOnly && { editable: false, readOnly: true })}
            right={
                canReveal ? (
                    <TextInput.Icon
                        icon={isTextSecureEntry ? 'eye' : 'eye-off'}
                        onPress={() => setIsTextSecureEntry(!isTextSecureEntry)}
                    />
                ) : null
            }
        />
    );
};

export default SecretInputText;
