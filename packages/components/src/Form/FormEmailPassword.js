import React, { useState } from 'react';

import { TextInput, Button } from '@jmstechnologiesinc/react-native-paper';
import ScreenWrapper from '../ScreenWrapper/ScreenWrapper';
import { localized } from '../Localization/Localization';

const FormEmailPassword = ({
    email,
    password,
    isEmailDisabled = false,
    isPasswordDisabled = false,
    confirmPassword = false,
    inputActionHandler,
    passwordConfirm,
    resetPassword = false,
    onPasswordReset,
    titleCredentials = false,
}) => {
    const [isTextSecureEntry, setIsTextSecureEntry] = useState(true);

    return (
        <>
            <ScreenWrapper.Section title={titleCredentials ? localized('credentials') : null}>
                <TextInput
                    label={localized('email')}
                    value={email}
                    onChangeText={(email) => inputActionHandler('email', email)}
                    disabled={isEmailDisabled}
                />
            </ScreenWrapper.Section>

            <ScreenWrapper.Section>
                <TextInput
                    label={localized('password')}
                    value={isPasswordDisabled ? '********' : password}
                    onChangeText={(password) => inputActionHandler('password', password)}
                    disabled={isPasswordDisabled}
                    secureTextEntry={isTextSecureEntry}
                    right={
                        !isPasswordDisabled && (
                            <TextInput.Icon
                                icon={isTextSecureEntry ? 'eye' : 'eye-off'}
                                onPress={() => setIsTextSecureEntry(!isTextSecureEntry)}
                            />
                        )
                    }
                />
            </ScreenWrapper.Section>

            {confirmPassword && (
                <ScreenWrapper.Section>
                    <TextInput
                        label={localized('confirmPassword')}
                        value={passwordConfirm}
                        onChangeText={(passwordConfirm) => inputActionHandler('passwordConfirm', passwordConfirm)}
                        disabled={isPasswordDisabled}
                        secureTextEntry={isTextSecureEntry}
                        right={
                            <TextInput.Icon
                                icon={isTextSecureEntry ? 'eye' : 'eye-off'}
                                onPress={() => setIsTextSecureEntry(!isTextSecureEntry)}
                            />
                        }
                    />
                </ScreenWrapper.Section>
            )}

            {resetPassword && (
                <ScreenWrapper.Section>
                    <Button mode="text" onPress={onPasswordReset}>
                        {localized('resetPassword')}
                    </Button>
                </ScreenWrapper.Section>
            )}
        </>
    );
};

export default FormEmailPassword;
