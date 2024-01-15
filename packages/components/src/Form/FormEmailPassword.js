import React, { useState } from 'react';

import { TextInput, Button } from '@jmstechnologiesinc/react-native-paper';
import ScreenWrapper from '../ScreenWrapper/ScreenWrapper';
import { localized } from '../Localization/Localization';

import SecretInputText from './SecretInputText';

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
                <SecretInputText
                    label={localized('password')}
                    value={isPasswordDisabled ? '********' : password}
                    onChangeText={(password) => inputActionHandler('password', password)}
                    disabled={isPasswordDisabled}
                />
            </ScreenWrapper.Section>

            {confirmPassword && (
                <ScreenWrapper.Section>
                    <SecretInputText
                        label={localized('confirmPassword')}
                        value={passwordConfirm}
                        onChangeText={(passwordConfirm) => inputActionHandler('passwordConfirm', passwordConfirm)}
                        disabled={isPasswordDisabled}
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
