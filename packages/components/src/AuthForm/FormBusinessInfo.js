import React from 'react';

import { TextInput } from '@jmsstudiosinc/react-native-paper';
import ScreenWrapper from '../ScreenWrapper/ScreenWrapper';
import { localized } from '../Localization/Localization';

const FormBusinessInfo = ({ storeTitle, storeAddress, industry, placeholder, inputActionHandler }) => {
    return (
        <>
            <ScreenWrapper.Section title={localized('Business Details')}>
                <TextInput
                    mode="outlined"
                    label={localized('Store Name')}
                    value={storeTitle}
                    onChangeText={(text) => inputActionHandler('storeTitle', text)}
                />
            </ScreenWrapper.Section>
            <ScreenWrapper.Section>
                <TextInput
                    mode="outlined"
                    label={localized('Full Store Address')}
                    value={storeAddress}
                    placeholder={placeholder}
                    onChangeText={(text) => inputActionHandler('storeAddress', text)}
                />
            </ScreenWrapper.Section>
            <ScreenWrapper.Section>
                <TextInput
                    mode="outlined"
                    label={localized('Industry')}
                    value={industry}
                    onChangeText={(text) => inputActionHandler('industry', text)}
                />
            </ScreenWrapper.Section>
        </>
    );
};

export default FormBusinessInfo;
