import React, { useState } from 'react';

import { TextInput, Button, MD3LightTheme } from '@jmstechnologiesinc/react-native-paper';
import ScreenWrapper from '../ScreenWrapper/ScreenWrapper';
import { localized } from '../Localization/Localization';

import SecretInputText from './SecretInputText';

const FormEmailPassword = ({
    title,
    loginTitle,
    signUpTitle,
    email,
    password,
    passwordConfirm,
    isLoading=false,
    isEmailDisabled = false,
    isPasswordDisabled = false,
    showConfirmPasswordInput = true,
    showPasswordInput = true,
    showResetPassword = false,
    showLoginButton=false,
    showSignupButton=false,
    mode,
    resetPasswordStyle,
    onLoginPress,
    onSignupPress,
    onPasswordReset,
    inputActionHandler,
}) => {
    return (
        <>
            <ScreenWrapper.Section title={title}>
                <TextInput
                    mode={mode}
                    label={localized('email')}
                    value={email}
                    onChangeText={(email) => inputActionHandler('email', email)}
                    disabled={isEmailDisabled}
                />
            </ScreenWrapper.Section>

            {showPasswordInput ? (
                <ScreenWrapper.Section>
                    <SecretInputText
                        mode={mode}
                        label={localized('password')}
                        value={isPasswordDisabled ? '********' : password}
                        onChangeText={(password) => inputActionHandler('password', password)}
                        disabled={isPasswordDisabled}
                    />
                </ScreenWrapper.Section>
            ) : null}

            {showConfirmPasswordInput && (
                <ScreenWrapper.Section>
                    <SecretInputText
                        mode={mode}
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
                    <Button 
                        mode="text" 
                        style={resetPasswordStyle}
                        onPress={onPasswordReset}>
                        {localized('resetPassword')}
                    </Button>
                </ScreenWrapper.Section>
            )}
        </>
    );
};

export default FormEmailPassword;
