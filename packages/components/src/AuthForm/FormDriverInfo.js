import React from 'react';

import { Paragraph, TextInput } from '@jmsstudiosinc/react-native-paper';
import ScreenWrapper from '../ScreenWrapper/ScreenWrapper';

const FormDriverInfo = ({
    labelDriver,
    labelZipCode,
    labelDateBirth,
    labelSsn,
    licenseNumer,
    zipcode,
    dateofBirth,
    ssn,
    title,
}) => {
    return (
        <>
            <ScreenWrapper.Section>
                <Paragraph>{title}</Paragraph>
            </ScreenWrapper.Section>

            <ScreenWrapper.Section>
                <TextInput
                    mode="outlined"
                    label={labelDriver}
                    value={licenseNumer}
                    onChangeText={(text) => inputActionHandler('licenseNumer', text)}
                />
            </ScreenWrapper.Section>
            <ScreenWrapper.Section>
                <TextInput
                    mode="outlined"
                    label={labelZipCode}
                    value={zipcode}
                    onChangeText={(text) => inputActionHandler('zipcode', text)}
                />
            </ScreenWrapper.Section>
            <ScreenWrapper.Section>
                <TextInput
                    mode="outlined"
                    label={labelDateBirth}
                    placeholder="MM/DD/YY"
                    value={dateofBirth}
                    onChangeText={(text) => inputActionHandler('dateofBirth', text)}
                />
            </ScreenWrapper.Section>
            <ScreenWrapper.Section>
                <TextInput
                    mode="outlined"
                    label={labelSsn}
                    placeholder="MM/DD/YY"
                    value={ssn}
                    onChangeText={(text) => inputActionHandler('ssn', text)}
                />
            </ScreenWrapper.Section>
        </>
    );
};

export default FormDriverInfo;
