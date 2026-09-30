import React from 'react';

import { Switch, List } from '@jmstechnologiesinc/react-native-paper';

import ScreenWrapper from '../ScreenWrapper';
import { localized } from '../Localization/Localization';

import FormField, { isHighlighted } from './FormField';
import FormSelectField from './FormSelectField';

/**
 * The vehicle in the market schema (canon §7.11, C-22), in the order of canon §9.15: type → year → make → model,
 * then color, plate, plate region and the optional VIN. The host hands the options: the vehicle types and colors
 * labelled from the partner package, the makes and models of the catalogue slice of the vehicle's type and year.
 * A type or year the catalogue has no slice for leaves make and model as typed text, as the server accepts them
 * then (it records the catalogue match, §9.8.6).
 *
 * A pick reports its value under the market name (`vehicleType`, `color`, `licensePlateRegion`, `vin`); a make or
 * a model reports its id and its name (`makeId` + `make`, `modelId` + `model`), because the server keeps both.
 */
const CatalogVehicleInfo = ({
    title,
    catalog,
    vehicleType,
    year,
    make,
    makeId,
    model,
    modelId,
    color,
    licensePlateNumber,
    licensePlateRegion,
    vin,
    inputActionHandler,
    disabled,
    highlightFields,
    errors,
}) => {
    const makes = catalog.makes ?? [];
    const models = catalog.models ?? [];
    const common = (field) => ({
        field,
        errors,
        highlighted: isHighlighted(highlightFields, field),
        disabled,
    });
    const pickNamed = (idField, nameField) => (option) => {
        inputActionHandler(idField, option.value);
        inputActionHandler(nameField, option.label);
    };

    return (
        <ScreenWrapper.Container>
            <ScreenWrapper.Section title={title}>
                <FormSelectField
                    {...common('vehicleType')}
                    label={localized('vehicleType')}
                    value={vehicleType}
                    options={catalog.vehicleTypes ?? []}
                    onSelect={(option) => inputActionHandler('vehicleType', option.value)}
                    testID="vehicle.vehicleType"
                />
            </ScreenWrapper.Section>
            <ScreenWrapper.Section>
                <FormField
                    mode="outlined"
                    {...common('year')}
                    label={localized('year')}
                    value={year}
                    keyboardType="numeric"
                    onChangeText={(text) => inputActionHandler('year', text)}
                />
            </ScreenWrapper.Section>
            <ScreenWrapper.Section>
                {makes.length ? (
                    <FormSelectField
                        {...common('make')}
                        label={localized('make')}
                        value={makeId}
                        displayValue={make}
                        options={makes}
                        onSelect={pickNamed('makeId', 'make')}
                        testID="vehicle.make"
                    />
                ) : (
                    <FormField
                        mode="outlined"
                        {...common('make')}
                        label={localized('make')}
                        value={make}
                        autoCapitalize="words"
                        onChangeText={(text) => inputActionHandler('make', text)}
                    />
                )}
            </ScreenWrapper.Section>
            <ScreenWrapper.Section>
                {models.length ? (
                    <FormSelectField
                        {...common('model')}
                        label={localized('model')}
                        value={modelId}
                        displayValue={model}
                        options={models}
                        onSelect={pickNamed('modelId', 'model')}
                        testID="vehicle.model"
                    />
                ) : (
                    <FormField
                        mode="outlined"
                        {...common('model')}
                        label={localized('model')}
                        value={model}
                        autoCapitalize="words"
                        onChangeText={(text) => inputActionHandler('model', text)}
                    />
                )}
            </ScreenWrapper.Section>
            <ScreenWrapper.Section>
                <FormSelectField
                    {...common('color')}
                    label={localized('color')}
                    value={color}
                    options={catalog.colors ?? []}
                    onSelect={(option) => inputActionHandler('color', option.value)}
                    testID="vehicle.color"
                />
            </ScreenWrapper.Section>
            <ScreenWrapper.Section>
                <FormField
                    mode="outlined"
                    {...common('licensePlateNumber')}
                    label={localized('licensePlateNumber')}
                    value={licensePlateNumber}
                    autoCapitalize="characters"
                    autoCorrect={false}
                    onChangeText={(text) => inputActionHandler('licensePlateNumber', text)}
                />
            </ScreenWrapper.Section>
            <ScreenWrapper.Section>
                <FormField
                    mode="outlined"
                    {...common('licensePlateRegion')}
                    label={localized('licensePlateRegion')}
                    value={licensePlateRegion}
                    autoCapitalize="characters"
                    autoCorrect={false}
                    onChangeText={(text) => inputActionHandler('licensePlateRegion', text)}
                />
            </ScreenWrapper.Section>
            <ScreenWrapper.Section>
                <FormField
                    mode="outlined"
                    {...common('vin')}
                    label={localized('vinOptional')}
                    value={vin}
                    autoCapitalize="characters"
                    autoCorrect={false}
                    onChangeText={(text) => inputActionHandler('vin', text)}
                />
            </ScreenWrapper.Section>
        </ScreenWrapper.Container>
    );
};

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
    // C-22, additive: with `catalog` the form speaks the market schema; without it, it renders as it always has.
    catalog,
    vehicleType,
    makeId,
    modelId,
    licensePlateRegion,
    vin,
}) => {
    const disabled = Boolean(isDisabled || readOnly);

    if (catalog) {
        return (
            <CatalogVehicleInfo
                title={title}
                catalog={catalog}
                vehicleType={vehicleType}
                year={year}
                make={make}
                makeId={makeId}
                model={model}
                modelId={modelId}
                color={color}
                licensePlateNumber={licensePlateNumber}
                licensePlateRegion={licensePlateRegion}
                vin={vin}
                inputActionHandler={inputActionHandler}
                disabled={disabled}
                highlightFields={highlightFields}
                errors={errors}
            />
        );
    }

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
