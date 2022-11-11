import React from 'react';

import { TextInput } from '@jmsstudiosinc/react-native-paper';
import ScreenWrapper from '../ScreenWrapper/ScreenWrapper';

const AuthFormEmailPassword = ({
    email,
    password,
    passwordConfirm,
    labelEmail,
    labelPassword,
    labelConfirmPassword,
    secureTextEntry = false,
    isEmailDisabled = false,
    isPasswordDisabled = false,
    confirmPassword = false,
    inputActionHandler,
}) => {
    return (
        <>
            <ScreenWrapper.Section>
                <TextInput
                    label={labelEmail}
                    value={email}
                    onChangeText={(email) => inputActionHandler('email', email)}
                    disabled={isEmailDisabled}
                />
            </ScreenWrapper.Section>
            <ScreenWrapper.Section>
                <TextInput
                    label={labelPassword}
                    value={password}
                    onChangeText={(password) => inputActionHandler('password', password)}
                    disabled={isPasswordDisabled}
                    secureTextEntry={secureTextEntry}
                />
            </ScreenWrapper.Section>
            {confirmPassword && (
                <ScreenWrapper.Section>
                    <TextInput
                        label={labelConfirmPassword}
                        value={passwordConfirm}
                        onChangeText={(passwordConfirm) => inputActionHandler('passwordConfirm', passwordConfirm)}
                        disabled={isPasswordDisabled}
                    />
                </ScreenWrapper.Section>
            )}
        </>
    );
};

export default AuthFormEmailPassword;
