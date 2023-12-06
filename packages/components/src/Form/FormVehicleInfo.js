import React from 'react';

import { TextInput, Switch, List } from '@jmstechnologiesinc/react-native-paper';
import ScreenWrapper from '../ScreenWrapper/ScreenWrapper';
import { localized } from '../Localization/Localization';

const FormVehicleInfo = ({
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
                title={localized('active')}
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
                        label={localized('make')}
                        value={make}
                        disabled={isDisabled}
                        onChangeText={(text) => inputActionHandler('make', text)}
                    />
                </ScreenWrapper.Section>
                <ScreenWrapper.Section>
                    <TextInput
                        mode="outlined"
                        label={localized('model')}
                        value={model}
                        disabled={isDisabled}
                        onChangeText={(text) => inputActionHandler('model', text)}
                    />
                </ScreenWrapper.Section>
                <ScreenWrapper.Section>
                    <TextInput
                        mode="outlined"
                        label={localized('color')}
                        value={color}
                        disabled={isDisabled}
                        onChangeText={(text) => inputActionHandler('color', text)}
                    />
                </ScreenWrapper.Section>

                <ScreenWrapper.Section>
                    <TextInput
                        mode="outlined"
                        label={localized('year')}
                        value={year}
                        disabled={isDisabled}
                        keyboardType="numeric"
                        onChangeText={(text) => inputActionHandler('year', text)}
                    />
                </ScreenWrapper.Section>
                <ScreenWrapper.Section>
                    <TextInput
                        mode="outlined"
                        label={localized('licensePlateNumber')}
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

export default FormVehicleInfo;
