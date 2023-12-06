import React, { useState } from 'react';

import { Paragraph, TextInput } from '@jmstechnologiesinc/react-native-paper';
import ScreenWrapper from '../ScreenWrapper/ScreenWrapper';
import { localized } from '../Localization/Localization';
import { handleDateOfBirhtChange } from './utils';

import Config from 'react-native-config';

const FormDriverInfo = ({ licenseNumer, ssn, inputActionHandler }) => {
    const [dateOfBirth, setDateOfBirth] = useState('');

    return (
        <>
            <ScreenWrapper.Section>
                <Paragraph>
                    {`${localized('grantingNewDriverAccess')} ${Config.LEGAL_ENTITY_NAME} ${localized(
                        'checkrBackgroundChecks'
                    )}`}
                </Paragraph>
            </ScreenWrapper.Section>

            <ScreenWrapper.Section>
                <TextInput
                    mode="outlined"
                    label={localized('driverLicenseNumber')}
                    value={licenseNumer}
                    secureTextEntry
                    onChangeText={(text) => inputActionHandler('licenseNumer', text)}
                />
            </ScreenWrapper.Section>
            <ScreenWrapper.Section>
                <TextInput
                    mode="outlined"
                    label={localized('dateBirth')}
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
                    label={localized('socialSecurityNumber')}
                    value={ssn}
                    secureTextEntry
                    onChangeText={(text) => inputActionHandler('ssn', text)}
                />
            </ScreenWrapper.Section>
        </>
    );
};

export default FormDriverInfo;
