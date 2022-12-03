import React from 'react';

import { TextInput } from '@jmsstudiosinc/react-native-paper';
import ScreenWrapper from '../ScreenWrapper/ScreenWrapper';

const FormPersonInfo = ({
    title,
    labelFirstName,
    firstName,
    inputActionHandler,
    labelLastName,
    lastName,
    labelPhone,
    phone,
}) => {
    return (
        <>
            <ScreenWrapper.Section title={title}>
                <TextInput
                    mode="outlined"
                    label={labelFirstName}
                    value={firstName}
                    onChangeText={(text) => inputActionHandler('firstName', text)}
                />
            </ScreenWrapper.Section>
            <ScreenWrapper.Section>
                <TextInput
                    mode="outlined"
                    label={labelLastName}
                    value={lastName}
                    onChangeText={(text) => inputActionHandler('lastName', text)}
                />
            </ScreenWrapper.Section>
            <ScreenWrapper.Section>
                <TextInput
                    mode="outlined"
                    label={labelPhone}
                    value={phone}
                    keyboardType='numeric'
                    onChangeText={(text) => inputActionHandler('phone', text)}
                />
            </ScreenWrapper.Section>
        </>
    );
};

export default FormPersonInfo;
