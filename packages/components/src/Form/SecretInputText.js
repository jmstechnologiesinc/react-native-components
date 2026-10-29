import React, { useState } from 'react';
import { TextInput } from '@jmstechnologiesinc/react-native-paper';

// The «show» toggle is an entry aid: it is offered only while the secret can be
// typed. A disabled or read-only (`editable={false}`) input keeps it masked.
const SecretInputText = ({ label, value, onChangeText, disabled, mode, ...rest }) => {
    const [isTextSecureEntry, setIsTextSecureEntry] = useState(true);
    const canReveal = !disabled && rest.editable !== false;

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
