import React from 'react';

import ScreenWrapper from '../ScreenWrapper';
import { localized } from '../Localization/Localization';

import CheckboxListField from '../CheckboxListField/CheckboxListField';
import FormField, { FieldErrorText, isHighlighted } from './FormField';
import FormSelectField from './FormSelectField';

// Input hints for each kind of field; none of them validates anything (K-32).
const WORDS = Object.freeze({ autoCapitalize: 'words' });
const CODE = Object.freeze({ autoCapitalize: 'characters', autoCorrect: false });
const NUMERIC = Object.freeze({ keyboardType: 'numeric' });

/**
 * The vehicle's details. Without `catalog` it is the form the app always had: make, model, color, year and plate as
 * typed text (pinned by `legacyRendering.test.js`).
 *
 * With `catalog` (C-22, additive) it is the market schema (canon §7.11), in the order of canon §9.15: type → year →
 * make → model, then color, plate, plate region and the optional VIN. The host hands the options: the vehicle types
 * and colors labelled from the partner package, the makes and models of the catalogue slice of the vehicle's type
 * and year. A type or year the catalogue has no slice for leaves make and model as typed text, as the server accepts
 * them then (it records the catalogue match, §9.8.6). A pick reports its value under the market name (`vehicleType`,
 * `color`, `licensePlateRegion`); a make or a model reports its id and its name (`makeId` + `make`, `modelId` +
 * `model`), because the server keeps both. The plate region is picked from `catalog.plateRegions` (the regions that
 * issue plates, contract request #62) when the host hands them, typed as an ISO code otherwise.
 *
 * With `catalog.flags` (C-d, contract request #77) the owner ticks what applies to the vehicle — a salvage or rebuilt
 * title, a rental, commercial branding — from the options the host labels from the partner package's VEHICLE_FLAG;
 * the form reports the whole list under `flags` (none ticked is `[]`, a declaration the server keeps).
 *
 * With `catalog.typeOnly` (contract request #91) the form is the vehicle type alone: the host says so for a vehicle
 * declared by its type (the partner package's non-motor types — a bicycle, an e-bike, a stand-up e-scooter), which
 * has no plate, make, model, year, colour, VIN or flags to ask.
 */
const FormVehicleInfo = ({
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
    catalog,
    vehicleType,
    makeId,
    modelId,
    licensePlateRegion,
    vin,
    flags,
}) => {
    const disabled = Boolean(isDisabled || readOnly);
    const marked = (field) => ({ field, errors, highlighted: isHighlighted(highlightFields, field), disabled });
    const textField = (field, label, value, hints) => (
        <FormField
            mode="outlined"
            {...marked(field)}
            label={localized(label)}
            value={value}
            {...hints}
            onChangeText={(text) => inputActionHandler(field, text)}
        />
    );
    const selectField = (field, value, options, onSelect, extra) => (
        <FormSelectField
            {...marked(field)}
            label={localized(field)}
            value={value}
            options={options ?? []}
            onSelect={onSelect}
            testID={`vehicle.${field}`}
            {...extra}
        />
    );
    // A make or a model: picked from the slice when it lists any, typed otherwise.
    const namedField = (field, idField, id, name, options) =>
        options?.length
            ? selectField(
                  field,
                  id,
                  options,
                  (option) => {
                      inputActionHandler(idField, option.value);
                      inputActionHandler(field, option.label);
                  },
                  { displayValue: name }
              )
            : textField(field, field, name, WORDS);

    const fields = catalog
        ? [
              selectField('vehicleType', vehicleType, catalog.vehicleTypes, (option) =>
                  inputActionHandler('vehicleType', option.value)
              ),
              textField('year', 'year', year, NUMERIC),
              namedField('make', 'makeId', makeId, make, catalog.makes),
              namedField('model', 'modelId', modelId, model, catalog.models),
              selectField('color', color, catalog.colors, (option) => inputActionHandler('color', option.value)),
              textField('licensePlateNumber', 'licensePlateNumber', licensePlateNumber, CODE),
              catalog.plateRegions?.length
                  ? selectField('licensePlateRegion', licensePlateRegion, catalog.plateRegions, (option) =>
                        inputActionHandler('licensePlateRegion', option.value)
                    )
                  : textField('licensePlateRegion', 'licensePlateRegion', licensePlateRegion, CODE),
              textField('vin', 'vinOptional', vin, CODE),
              ...(catalog.flags?.length
                  ? [
                        <>
                            <CheckboxListField
                                label={localized('vehicleFlags')}
                                options={catalog.flags}
                                values={flags ?? []}
                                onChange={(next) => inputActionHandler('flags', next)}
                                disabled={disabled}
                                testID="vehicle.flags"
                            />
                            <FieldErrorText field="flags" errors={errors} />
                        </>,
                    ]
                  : []),
          ]
        : [
              textField('make', 'make', make, WORDS),
              textField('model', 'model', model, WORDS),
              textField('color', 'color', color, WORDS),
              textField('year', 'year', year, NUMERIC),
              textField('licensePlateNumber', 'licensePlateNumber', licensePlateNumber, CODE),
          ];
    // A vehicle declared by its type alone (#91): the type, the market form's first field, and nothing else.
    const shown = catalog?.typeOnly ? fields.slice(0, 1) : fields;

    return (
        <ScreenWrapper.Container>
            {shown.map((input, index) => (
                // The fields never reorder while mounted: the position is a stable key.
                // eslint-disable-next-line react/no-array-index-key
                <ScreenWrapper.Section key={index} title={index === 0 ? title : undefined}>
                    {input}
                </ScreenWrapper.Section>
            ))}
        </ScreenWrapper.Container>
    );
};

export default FormVehicleInfo;
