import React from 'react';

import { Switch, List } from '@jmstechnologiesinc/react-native-paper';

import ScreenWrapper from '../ScreenWrapper';
import { localized } from '../Localization/Localization';

import FormField, { isHighlighted } from './FormField';

const FormVehicleInfo = ({
    selected,
    active,
    title,
    make,
    model,
    color,
    year,
    licensePlateNumber,
    inputActionHandler,
    isDisabled,
    readOnly = false,
    highlightFields,
    errors,
}) => {
    const disabled = Boolean(isDisabled || readOnly);

    return (
        <>
            {/*  <List.Item
                title={localized('active')}
                disabled={active}
                right={() => (
                    <Switch
                        disabled={isDisabled}
                        value={selected}
                        onValueChange={(text) => inputActionHandler('selected', text)}
                    />
                )}
            /> */}
            <ScreenWrapper.Container>
                <ScreenWrapper.Section title={title}>
                    <FormField
                        mode="outlined"
                        field="make"
                        errors={errors}
                        highlighted={isHighlighted(highlightFields, 'make')}
                        disabled={disabled}
                        label={localized('make')}
                        value={make}
                        autoCapitalize="words"
                        onChangeText={(text) => inputActionHandler('make', text)}
                    />
                </ScreenWrapper.Section>
                <ScreenWrapper.Section>
                    <FormField
                        mode="outlined"
                        field="model"
                        errors={errors}
                        highlighted={isHighlighted(highlightFields, 'model')}
                        disabled={disabled}
                        label={localized('model')}
                        value={model}
                        autoCapitalize="words"
                        onChangeText={(text) => inputActionHandler('model', text)}
                    />
                </ScreenWrapper.Section>
                <ScreenWrapper.Section>
                    <FormField
                        mode="outlined"
                        field="color"
                        errors={errors}
                        highlighted={isHighlighted(highlightFields, 'color')}
                        disabled={disabled}
                        label={localized('color')}
                        value={color}
                        autoCapitalize="words"
                        onChangeText={(text) => inputActionHandler('color', text)}
                    />
                </ScreenWrapper.Section>

                <ScreenWrapper.Section>
                    <FormField
                        mode="outlined"
                        field="year"
                        errors={errors}
                        highlighted={isHighlighted(highlightFields, 'year')}
                        disabled={disabled}
                        label={localized('year')}
                        value={year}
                        keyboardType="numeric"
                        onChangeText={(text) => inputActionHandler('year', text)}
                    />
                </ScreenWrapper.Section>
                <ScreenWrapper.Section>
                    <FormField
                        mode="outlined"
                        field="licensePlateNumber"
                        errors={errors}
                        highlighted={isHighlighted(highlightFields, 'licensePlateNumber')}
                        disabled={disabled}
                        label={localized('licensePlateNumber')}
                        value={licensePlateNumber}
                        autoCapitalize="characters"
                        autoCorrect={false}
                        onChangeText={(text) => inputActionHandler('licensePlateNumber', text)}
                    />
                </ScreenWrapper.Section>
            </ScreenWrapper.Container>
        </>
    );
};

export default FormVehicleInfo;
