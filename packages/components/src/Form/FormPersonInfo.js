import React from 'react';

import { TextInput } from '@jmstechnologiesinc/react-native-paper';
import ScreenWrapper from '@jmstechnologiesinc/react-native-components/lib/ScreenWrapper/ScreenWrapper';
import { localized } from '@jmstechnologiesinc/react-native-components/lib/Localization/Localization';

const FormPersonInfo = ({ isDisabled, firstName, inputActionHandler, lastName, phone }) => {
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
            <ScreenWrapper.Section>
                <TextInput
                    mode="outlined"
                    label={localized('phoneNumber')}
                    value={phone}
                    disabled={isDisabled}
                    keyboardType="numeric"
                    onChangeText={(text) => inputActionHandler('phone', text)}
                />
            </ScreenWrapper.Section>
        </>
    );
};

export default FormPersonInfo;
