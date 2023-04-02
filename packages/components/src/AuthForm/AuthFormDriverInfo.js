import React, { useState } from 'react';

import { Paragraph, TextInput } from '@jmsstudiosinc/react-native-paper';
import ScreenWrapper from '../ScreenWrapper/ScreenWrapper';
import { localized } from '../Localization/Localization';
import { handleDateOfBirhtChange } from './utils';

const AuthFormDriverInfo = ({ licenseNumer, zipcode, ssn, inputActionHandler }) => {
    const [dateOfBirth, setDateOfBirth] = useState('');
    return (
        <>
            <ScreenWrapper.Section>
                <Paragraph>
                    {localized(
                        'Before granting new drivers to access the platform, JMS uses Checkr as its third-party provider to run secure background checks. to ensure safety and security of all members of its platform.'
                    )}
                </Paragraph>
            </ScreenWrapper.Section>

            <ScreenWrapper.Section>
                <TextInput
                    mode="outlined"
                    label={localized('Driver is license numer')}
                    value={licenseNumer}
                    onChangeText={(text) => inputActionHandler('licenseNumer', text)}
                />
            </ScreenWrapper.Section>
            <ScreenWrapper.Section>
                <TextInput
                    mode="outlined"
                    label={localized('Zip code')}
                    value={zipcode}
                    keyboardType="numeric"
                    onChangeText={(text) => inputActionHandler('zipcode', text)}
                />
            </ScreenWrapper.Section>
            <ScreenWrapper.Section>
                <TextInput
                    mode="outlined"
                    label={localized('Date of Birth')}
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
                    label={localized('Social Security Number')}
                    placeholder="MM/DD/YY"
                    value={ssn}
                    onChangeText={(text) => inputActionHandler('ssn', text)}
                />
            </ScreenWrapper.Section>
        </>
    );
};

export default AuthFormDriverInfo;
