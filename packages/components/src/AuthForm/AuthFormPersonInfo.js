import React from 'react';

import { TextInput } from '@jmstechnologiesinc/react-native-paper';
import ScreenWrapper from '../ScreenWrapper/ScreenWrapper';
import { localized } from '../Localization/Localization';

const AuthFormPersonInfo = ({ isDisabled, firstName, inputActionHandler, lastName, phone }) => {
    return (
        <>
            <ScreenWrapper.Section title={localized('Contact details')}>
                <TextInput
                    mode="outlined"
                    label={localized('First name')}
                    value={firstName}
                    disabled={isDisabled}
                    onChangeText={(text) => inputActionHandler('firstName', text)}
                />
            </ScreenWrapper.Section>
            <ScreenWrapper.Section>
                <TextInput
                    mode="outlined"
                    label={localized('Last name')}
                    value={lastName}
                    disabled={isDisabled}
                    onChangeText={(text) => inputActionHandler('lastName', text)}
                />
            </ScreenWrapper.Section>
            <ScreenWrapper.Section>
                <TextInput
                    mode="outlined"
                    label={localized('Phone number')}
                    value={phone}
                    disabled={isDisabled}
                    keyboardType="numeric"
                    onChangeText={(text) => inputActionHandler('phone', text)}
                />
            </ScreenWrapper.Section>
        </>
    );
};

export default AuthFormPersonInfo;
