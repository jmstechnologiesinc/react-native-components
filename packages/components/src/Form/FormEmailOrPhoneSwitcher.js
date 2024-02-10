import React, { useState } from 'react'
import { Button, MD3LightTheme } from '@jmstechnologiesinc/react-native-paper'

import FormPhoneNumber from './FormPhoneNumber'
import EmailPassword from './FormEmailPassword'
import ScreenWrapper from '../ScreenWrapper'
import { localized } from '../Localization/Localization'

const LOGIN_OPTIONS = {
    PHONE: "PHONE",
    EMAIL: "EMAIL"
}

const EmailOrPhoneSwitcher = ({
    email,
    password,
    inputActionHandler,
    isLoading,
    onEmailPasswordPress,
    onPhoneNumberPress,
    title,
    onSignupPress,
    onForgotPasswordPress,
    showPhoneLogin
}) => {
    const [selectedLogin, setSelectedLogin] = useState(LOGIN_OPTIONS.PHONE)
    return (
        <>
            {
                selectedLogin === LOGIN_OPTIONS.PHONE && showPhoneLogin ?
                    <>
                        <FormPhoneNumber
                            onPhoneNumberPress={onPhoneNumberPress}
                        />

                        <ScreenWrapper.Section>
                            <Button
                                mode='outlined'
                                onPress={() => setSelectedLogin(LOGIN_OPTIONS.EMAIL)}

                            >
                                {localized('continueEmail')}
                            </Button>
                        </ScreenWrapper.Section>

                    </>
                    :
                    <>
                        <EmailPassword
                            email={email}
                            password={password}
                            inputActionHandler={inputActionHandler}
                        />
                        <ScreenWrapper.Section>
                            <Button
                                loading={isLoading}
                                disabled={isLoading}
                                mode="contained"
                                onPress={onEmailPasswordPress}
                                style={{ marginTop: MD3LightTheme.spacing.x3 }}
                            >
                                {localized('logIn')}
                            </Button>
                        </ScreenWrapper.Section>


                        {showPhoneLogin && <ScreenWrapper.Section>
                            <Button
                                mode='outlined'
                                onPress={() => setSelectedLogin(LOGIN_OPTIONS.PHONE)}
                            >
                                {localized('continuePhoneNumber')}
                            </Button>
                        </ScreenWrapper.Section>}

                        <ScreenWrapper.Section>
                            <Button
                                mode="outlined"
                                onPress={onSignupPress}
                            >
                                {localized(title)}
                            </Button>
                        </ScreenWrapper.Section>

                        <ScreenWrapper.Section>
                            <Button onPress={onForgotPasswordPress} >{localized('resetPassword')}</Button>
                        </ScreenWrapper.Section>

                    </>
            }

        </>
    )
}


export default EmailOrPhoneSwitcher