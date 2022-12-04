import React, { useState } from 'react';

import { TextInput, Button } from '@jmsstudiosinc/react-native-paper';
import ScreenWrapper from '../ScreenWrapper/ScreenWrapper';
import { localized } from '../Localization/Localization';

const AuthFormEmailPassword = ({
    email,
    password,
    isEmailDisabled = false,
    isPasswordDisabled = false,
    confirmPassword = false,
    inputActionHandler,
    passwordConfirm,
    resetPassword = false,
    onPasswordReset,
}) => {
    const [isTextSecureEntry, setIsTextSecureEntry] = useState(true);

    return (
        <>
            <ScreenWrapper.Section title={localized('Contact Details')}>
                <TextInput
                    label={localized('Email')}
                    value={email}
                    onChangeText={(email) => inputActionHandler('email', email)}
                    disabled={isEmailDisabled}
                />
            </ScreenWrapper.Section>

            <ScreenWrapper.Section>
                <TextInput
                    label={localized('Password')}
                    value={password}
                    onChangeText={(password) => inputActionHandler('password', password)}
                    disabled={isPasswordDisabled}
                    secureTextEntry={isTextSecureEntry}
                    right={
                        !isPasswordDisabled && (
                            <TextInput.Icon
                                name={isTextSecureEntry ? 'eye' : 'eye-off'}
                                onPress={() => setIsTextSecureEntry(!isTextSecureEntry)}
                            />
                        )
                    }
                />
            </ScreenWrapper.Section>

            {confirmPassword && (
                <ScreenWrapper.Section>
                    <TextInput
                        label={localized('Confirm Password')}
                        value={passwordConfirm}
                        onChangeText={(passwordConfirm) => inputActionHandler('passwordConfirm', passwordConfirm)}
                        disabled={isPasswordDisabled}
                        secureTextEntry={isTextSecureEntry}
                        right={
                            <TextInput.Icon
                                name={isTextSecureEntry ? 'eye' : 'eye-off'}
                                onPress={() => setIsTextSecureEntry(!isTextSecureEntry)}
                            />
                        }
                    />
                </ScreenWrapper.Section>
            )}

            {resetPassword && (
                <ScreenWrapper.Section>
                    <Button mode="text" onPress={onPasswordReset}>
                        {localized('Reset password')}
                    </Button>
                </ScreenWrapper.Section>
            )}
        </>
    );
};

export default AuthFormEmailPassword;
