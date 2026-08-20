import React, { useState } from 'react';
import { TextInput } from '@jmstechnologiesinc/react-native-paper';

const SecretInputText = ({ label, value, onChangeText, disabled, mode, ...rest }) => {
    const [isTextSecureEntry, setIsTextSecureEntry] = useState(true);

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
                !disabled ? (
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
