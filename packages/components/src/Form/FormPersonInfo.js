import React from 'react';

import { TextInput } from '@jmstechnologiesinc/react-native-paper';
import ScreenWrapper from '../ScreenWrapper/ScreenWrapper';
import { localized } from '../Localization/Localization';

const FormPersonInfo = ({ 
    firstName, 
    lastName, 
    phone, 
    email, 
    isDisabled, 
    showPhoneInput = true,
    showEmailInput = true,
    inputActionHandler, 
}) => {
    return (
        <>
            <ScreenWrapper.Section title={localized('contactDetails')}>
                <TextInput
                    mode="outlined"
                    label={localized('firstName')}
                    value={firstName}
                    disabled={isDisabled}
                    onChangeText={(text) => inputActionHandler('firstName', text)}
                />
            </ScreenWrapper.Section>
            <ScreenWrapper.Section>
                <TextInput
                    mode="outlined"
                    label={localized('lastName')}
                    value={lastName}
                    disabled={isDisabled}
                    onChangeText={(text) => inputActionHandler('lastName', text)}
                />
            </ScreenWrapper.Section>

            {showEmailInput ? (
                <ScreenWrapper.Section>
                    <TextInput
                        mode='outlined'
                        label={localized('email')}
                        value={email}
                        onChangeText={(email) => inputActionHandler('email', email)}
                    />
                </ScreenWrapper.Section>
            ) : null}
                
            {showPhoneInput ? (
                <ScreenWrapper.Section>
                    <TextInput
                        mode="outlined"
                        label={localized('phoneNumber')}
                        value={phone}
                        disabled={isDisabled}
                        keyboardType="numeric"
                        onChangeText={(text) => inputActionHandler('phone', text)} />
                </ScreenWrapper.Section>
            ) : null}
        </>
    );
};

export default FormPersonInfo;
