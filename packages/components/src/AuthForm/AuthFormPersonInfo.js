import React from 'react';

import { TextInput } from '@jmsstudiosinc/react-native-paper';
import ScreenWrapper from '../ScreenWrapper/ScreenWrapper';
import { localized } from '../Localization/Localization';

const AuthFormPersonInfo = ({ firstName, inputActionHandler, lastName, phone }) => {
    return (
        <>
            <ScreenWrapper.Section title={localized('Contact Details')}>
                <TextInput
                    mode="outlined"
                    label={localized('First Name')}
                    value={firstName}
                    onChangeText={(text) => inputActionHandler('firstName', text)}
                />
            </ScreenWrapper.Section>
            <ScreenWrapper.Section>
                <TextInput
                    mode="outlined"
                    label={localized('Last Name')}
                    value={lastName}
                    onChangeText={(text) => inputActionHandler('lastName', text)}
                />
            </ScreenWrapper.Section>
            <ScreenWrapper.Section>
                <TextInput
                    mode="outlined"
                    label={localized('Phone Number')}
                    value={phone}
                    keyboardType="numeric"
                    onChangeText={(text) => inputActionHandler('phone', text)}
                />
            </ScreenWrapper.Section>
        </>
    );
};

export default AuthFormPersonInfo;
