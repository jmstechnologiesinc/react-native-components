import React, { useState } from 'react'
import { Button, MD3LightTheme } from '@jmstechnologiesinc/react-native-paper'

import FormPhoneNumber from './FormPhoneNumber'
import EmailPassword from './FormEmailPassword'
import ScreenWrapper from '../ScreenWrapper'
import { localized } from '../Localization/Localization'
import OrDividerContainer from '../OrDividerContainer/OrDividerContainer'

const OPTION_LOGIN = {
    PHONE: "PHONE",
    EMAIL: "EMAIL"
}

const EmailOrPhoneSwitcher = ({
    email,
    password,
    inputActionHandler,
    isLoading,
    onEmailPasswordPress,
    onPressSend,
    title,
    onSignupPress,
    onForgotPasswordPress,
    isVendorOrDriver
}) => {
    const [isSelected, setSelected] = useState(OPTION_LOGIN.PHONE)

    return (
        <>
            {
                isSelected === OPTION_LOGIN.PHONE && !isVendorOrDriver ?
                    <>
                        <FormPhoneNumber
                            onPressSend={onPressSend}
                        />

                        <ScreenWrapper.Section>
                            <Button
                                mode='outlined'
                                onPress={() => setSelected(OPTION_LOGIN.EMAIL)}

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


                        {!isVendorOrDriver && <ScreenWrapper.Section>
                            <Button
                                mode='outlined'
                                onPress={() => setSelected(OPTION_LOGIN.PHONE)}
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