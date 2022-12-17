import React from 'react';

import { TextInput } from '@jmsstudiosinc/react-native-paper';
import ScreenWrapper from '../ScreenWrapper/ScreenWrapper';
import { localized } from '../Localization/Localization';

const AuthFormPersonInfo = ({ make, model, color, year, inputActionHandler }) => {
    return (
        <>
            <ScreenWrapper.Section title={localized('Vehicle Details')}>
                <TextInput
                    mode="outlined"
                    label={localized('Make')}
                    value={make}
                    onChangeText={(text) => inputActionHandler('make', text)}
                />
            </ScreenWrapper.Section>
            <ScreenWrapper.Section>
                <TextInput
                    mode="outlined"
                    label={localized('Model')}
                    value={model}
                    onChangeText={(text) => inputActionHandler('model', text)}
                />
            </ScreenWrapper.Section>
            <ScreenWrapper.Section>
                <TextInput
                    mode="outlined"
                    label={localized('Color')}
                    value={color}
                    onChangeText={(text) => inputActionHandler('color', text)}
                />
            </ScreenWrapper.Section>

            <ScreenWrapper.Section>
                <TextInput
                    mode="outlined"
                    label={localized('Year')}
                    value={year}
                    keyboardType="numeric"
                    onChangeText={(text) => inputActionHandler('year', text)}
                />
            </ScreenWrapper.Section>
        </>
    );
};

export default AuthFormPersonInfo;
