import React from 'react';

import { TextInput, Button } from '@jmstechnologiesinc/react-native-paper';
import ScreenWrapper from '../ScreenWrapper/ScreenWrapper';
import { localized } from '../Localization/Localization';

import SecretInputText from './SecretInputText';

const FormEmailPassword = ({
    titleCredentials = false,
    loginTitle,
    signUpTitle,
    email,
    password,
    isLoading=false,
    isEmailDisabled = false,
    isPasswordDisabled = false,
    confirmPassword = false,
    passwordConfirm,
    showResetPassword = false,
    showLoginButton=false,
    showSignupButton=false,
    onLoginPress,
    onSignupPress,
    onPasswordReset,
    inputActionHandler,
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

            {showLoginButton ? (
                <ScreenWrapper.Section >
                    <Button
                        mode="contained"
                        loading={isLoading}
                        disabled={isLoading}
                        onPress={onLoginPress}
                    >
                        {localized(loginTitle)}
                    </Button>
                </ScreenWrapper.Section>
            ) : null}

            {showSignupButton ? (
                <ScreenWrapper.Section>
                    <Button
                        mode="outlined"
                        onPress={onSignupPress}
                    >
                        {localized(signUpTitle)}
                </Button>
                </ScreenWrapper.Section>
            ) : null}

            {showResetPassword && (
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
