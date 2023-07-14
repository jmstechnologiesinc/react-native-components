import React from 'react';

import { TextInput } from '@jmstechnologiesinc/react-native-paper';
import ScreenWrapper from '../ScreenWrapper/ScreenWrapper';
import { localized } from '../Localization/Localization';
import { Switch, List } from '@jmstechnologiesinc/react-native-paper';

const AuthFormVehicle = ({
    active,
    title,
    make,
    model,
    color,
    year,
    licensePlateNumber,
    inputActionHandler,
    isDisabled,
}) => {
    return (
        <>
            <List.Item
                title={localized('authForm.active')}
                disabled={true}
                right={() => (
                    <Switch
                        disabled={true}
                        value={active}
                        onValueChange={(text) => inputActionHandler('active', text)}
                    />
                )}
            />
            <ScreenWrapper.Container>
                <ScreenWrapper.Section title={title}>
                    <TextInput
                        mode="outlined"
                        label={localized('authForm.make')}
                        value={make}
                        disabled={isDisabled}
                        onChangeText={(text) => inputActionHandler('make', text)}
                    />
                </ScreenWrapper.Section>
                <ScreenWrapper.Section>
                    <TextInput
                        mode="outlined"
                        label={localized('authForm.model')}
                        value={model}
                        disabled={isDisabled}
                        onChangeText={(text) => inputActionHandler('model', text)}
                    />
                </ScreenWrapper.Section>
                <ScreenWrapper.Section>
                    <TextInput
                        mode="outlined"
                        label={localized('authForm.color')}
                        value={color}
                        disabled={isDisabled}
                        onChangeText={(text) => inputActionHandler('color', text)}
                    />
                </ScreenWrapper.Section>

                <ScreenWrapper.Section>
                    <TextInput
                        mode="outlined"
                        label={localized('authForm.year')}
                        value={year}
                        disabled={isDisabled}
                        keyboardType="numeric"
                        onChangeText={(text) => inputActionHandler('year', text)}
                    />
                </ScreenWrapper.Section>
                <ScreenWrapper.Section>
                    <TextInput
                        mode="outlined"
                        label={localized('authForm.licensePlateNumber')}
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
