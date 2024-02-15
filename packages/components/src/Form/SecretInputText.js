import React, { useState } from 'react'
import { TextInput } from '@jmstechnologiesinc/react-native-paper';


const SecretInputText =({ label, value, onChangeText, disabled, mode }) => {
    const [isTextSecureEntry, setIsTextSecureEntry] = useState(true);

    return (
        <TextInput
            label={label}
            value={value}
            onChangeText={onChangeText}
            disabled={disabled}
            mode={mode}
            secureTextEntry={isTextSecureEntry}
            right={
                !disabled ? (
                    <TextInput.Icon
                        icon={isTextSecureEntry ? 'eye' : 'eye-off'}
                        onPress={() => setIsTextSecureEntry(!isTextSecureEntry)}
                        />
                ) : null
            }
        />
    )
}


export default SecretInputText