import React from 'react'
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

const FormWrapperContact = ({
    isSelected = OPTION_LOGIN.PHONE,
    email,
    password,
    inputActionHandler,
    isLoading,
    onLoginUIPress,
    onEmailPasswordPress,
    onPressSend
}) => {
    return (
        <>
            {
                isSelected === OPTION_LOGIN.PHONE ?
                    <>
                        <FormPhoneNumber
                            onPressSend={onPressSend}
                        />

                        <OrDividerContainer />
                        <ScreenWrapper.Section>
                            <Button
                                mode='outlined'
                                onPress={() => onLoginUIPress(OPTION_LOGIN.EMAIL)}
                                style={{ marginTop: MD3LightTheme.spacing.x3 }}
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

                        <OrDividerContainer />


                        <ScreenWrapper.Section>
                            <Button
                                mode='outlined'
                                onPress={() => onLoginUIPress(OPTION_LOGIN.PHONE)}
                                style={{ marginTop: MD3LightTheme.spacing.x3 }}
                            >
                                {localized('continuePhoneNumber')}
                            </Button>
                        </ScreenWrapper.Section>
                    </>
            }

        </>
    )
}


export default FormWrapperContact