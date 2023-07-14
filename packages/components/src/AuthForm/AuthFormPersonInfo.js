import React from 'react';

import { TextInput } from '@jmstechnologiesinc/react-native-paper';
import ScreenWrapper from '../ScreenWrapper/ScreenWrapper';
import { localized } from '../Localization/Localization';

const AuthFormPersonInfo = ({ isDisabled, firstName, inputActionHandler, lastName, phone }) => {
    return (
        <>
            <ScreenWrapper.Section title={localized('authForm.contactDetails')}>
                <TextInput
                    mode="outlined"
                    label={localized('authForm.firstName')}
                    value={firstName}
                    disabled={isDisabled}
                    onChangeText={(text) => inputActionHandler('firstName', text)}
                />
            </ScreenWrapper.Section>
            <ScreenWrapper.Section>
                <TextInput
                    mode="outlined"
                    label={localized('authForm.lastName')}
                    value={lastName}
                    disabled={isDisabled}
                    onChangeText={(text) => inputActionHandler('lastName', text)}
                />
            </ScreenWrapper.Section>
            <ScreenWrapper.Section>
                <TextInput
                    mode="outlined"
                    label={localized('authForm.phoneNumber')}
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
