import React from 'react';

import { TextInput } from '@jmstechnologiesinc/react-native-paper';
import ScreenWrapper from '../ScreenWrapper/ScreenWrapper';
import { localized } from '../Localization/Localization';
import { Switch, List } from '@jmstechnologiesinc/react-native-paper';

const AuthFormVehicle = ({active, title, make, model, color, year, licensePlateNumber, inputActionHandler, isDisabled }) => {
    return (
        <>
            <List.Item
                    title={localized('Active')}
                    disabled={isDisabled}
                    right={() => <Switch disabled={isDisabled} value={active} onValueChange={(text) => inputActionHandler('active', text)} />}
            />
            <ScreenWrapper.Container>
            <ScreenWrapper.Section title={title}>
                <TextInput
                    mode="outlined"
                    label={localized('Make')}
                    value={make}
                    disabled={isDisabled}
                    onChangeText={(text) => inputActionHandler('make', text)}
                />
            </ScreenWrapper.Section>
            <ScreenWrapper.Section>
                <TextInput
                    mode="outlined"
                    label={localized('Model')}
                    value={model}
                    disabled={isDisabled}
                    onChangeText={(text) => inputActionHandler('model', text)}
                />
            </ScreenWrapper.Section>
            <ScreenWrapper.Section>
                <TextInput
                    mode="outlined"
                    label={localized('Color')}
                    value={color}
                    disabled={isDisabled}
                    onChangeText={(text) => inputActionHandler('color', text)}
                />
            </ScreenWrapper.Section>

            <ScreenWrapper.Section>
                <TextInput
                    mode="outlined"
                    label={localized('Year')}
                    value={year}
                    disabled={isDisabled}
                    keyboardType="numeric"
                    onChangeText={(text) => inputActionHandler('year', text)}
                />
            </ScreenWrapper.Section>
            <ScreenWrapper.Section>
                <TextInput
                    mode="outlined"
                    label={localized('License Plate Number')}
                    value={licensePlateNumber}
                    disabled={isDisabled}
                    keyboardType="numeric"
                    onChangeText={(text) => inputActionHandler('licensePlateNumber', text)}
                />
            </ScreenWrapper.Section>
            </ScreenWrapper.Container>
        </>
    );
};

export default AuthFormVehicle;
