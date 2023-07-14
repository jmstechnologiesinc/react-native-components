import React, { useState } from 'react';

import { Paragraph, TextInput } from '@jmstechnologiesinc/react-native-paper';
import ScreenWrapper from '../ScreenWrapper/ScreenWrapper';
import { localized } from '../Localization/Localization';
import { handleDateOfBirhtChange } from './utils';
import Config from 'react-native-config';

const AuthFormDriverInfo = ({ licenseNumer, ssn, inputActionHandler }) => {
    const [dateOfBirth, setDateOfBirth] = useState('');

    return (
        <>
            <ScreenWrapper.Section>
                <Paragraph>
                    {`${localized('authForm.beforeGrantingDriverAccess')} ${Config.LEGAL_ENTITY_NAME} ${localized(
                        'authForm.usesCheckrForBackgroundChecks'
                    )} `}
                </Paragraph>
            </ScreenWrapper.Section>

            <ScreenWrapper.Section>
                <TextInput
                    mode="outlined"
                    label={localized('authForm.driverLicenseNumber')}
                    secureTextEntry={true}
                    value={licenseNumer}
                    onChangeText={(text) => inputActionHandler('licenseNumer', text)}
                />
            </ScreenWrapper.Section>
            <ScreenWrapper.Section>
                <TextInput
                    mode="outlined"
                    label={localized('authForm.dateOfBirth')}
                    placeholder="MM/DD/YY"
                    value={dateOfBirth}
                    keyboardType="numeric"
                    maxLength={10}
                    onChangeText={(text) =>
                        handleDateOfBirhtChange(text, inputActionHandler, setDateOfBirth, dateOfBirth)
                    }
                />
            </ScreenWrapper.Section>
            <ScreenWrapper.Section>
                <TextInput
                    mode="outlined"
                    label={localized('authForm.socialSecurityNumber')}
                    value={ssn}
                    secureTextEntry={true}
                    onChangeText={(text) => inputActionHandler('ssn', text)}
                />
            </ScreenWrapper.Section>
        </>
    );
};

export default AuthFormDriverInfo;
