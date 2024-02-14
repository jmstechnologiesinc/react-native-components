import React, { useEffect, useState } from 'react'
import { Button,  Text } from '@jmstechnologiesinc/react-native-paper'

import FormPhoneNumber from './FormPhoneNumber'
import EmailPassword from './FormEmailPassword'
import ScreenWrapper from '../ScreenWrapper'
import { localized } from '../Localization/Localization'

const LOGIN_OPTIONS = {
    PHONE: "PHONE",
    EMAIL: "EMAIL"
}

const EmailOrPhoneSwitcher = ({
    signUpTitle,
    email,
    password,
    isLoading,
    isSwitcherEnable=true,
    initialLoginOption=LOGIN_OPTIONS.PHONE,
    resetPassword,
    onEmailPasswordLoginPress,
    onPhoneNumberPress,
    onSignupPress,
    onForgotPasswordPress,
    inputActionHandler,
}) => {
    const [selectedLogin, setSelectedLogin] = useState(initialLoginOption);

    useEffect(() => {
        setSelectedLogin(initialLoginOption);
    }, [initialLoginOption])

    return  <>
        {selectedLogin === LOGIN_OPTIONS.PHONE ? (
            <FormPhoneNumber 
                onPhoneNumberPress={onPhoneNumberPress} />
        ) : (
            <EmailPassword
                loginTitle={localized('logIn')}
                signUpTitle={signUpTitle}
                isLoading={isLoading}
                email={email}
                password={password}
                showLoginButton
                showSignupButton
                resetPassword={resetPassword}
                onLoginPress={onEmailPasswordLoginPress}
                onSignupPress={onSignupPress}
                onPasswordReset={onForgotPasswordPress}
                inputActionHandler={inputActionHandler}
            />
        )}

        {isSwitcherEnable ? (
            <>
                <ScreenWrapper.Section>
                    <Text style={{ textAlign: 'center' }}>OR</Text>
                </ScreenWrapper.Section>
                <ScreenWrapper.Section>
                    <Button
                        mode="contained-tonal"
                        onPress={() => setSelectedLogin(selectedLogin === LOGIN_OPTIONS.PHONE ? LOGIN_OPTIONS.EMAIL : LOGIN_OPTIONS.PHONE)}
                    >
                        {localized(selectedLogin === LOGIN_OPTIONS.PHONE ? 'continueEmail' : 'continuePhoneNumber')}
                    </Button>
                </ScreenWrapper.Section>
            </>
        ) : null}
    </>
}

export default EmailOrPhoneSwitcher