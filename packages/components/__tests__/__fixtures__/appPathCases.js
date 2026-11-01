/**
 * The app's paths of the components the console's read-only fix touches (alta y consola plan, phase 2): the props
 * CustomerApp's ProfileView, VehicleView, BusinessInfoView, MultipleRoleSignUp and PayoutFrequencyScreen pass —
 * editable, with server errors, or `isDisabled`; never `readOnly`, which only the console passes.
 *
 * One definition for both sides of the comparison: `legacyTrees.capture.test.js` renders these cases from the source
 * before the fix (`main` @ 556ccd4) into `legacyTrees.json`, and `legacyRendering.test.js` renders them from the
 * current source and requires the same trees. `load(file)` requires a module of the source being rendered.
 */
import React from 'react';

const PERSON = { firstName: 'Jose', lastName: 'Santos', email: 'jose@example.com', phoneNumber: '8297872134' };

const LEGACY_VEHICLE = { make: 'Toyota', model: 'Camry', color: 'White', year: '2019', licensePlateNumber: 'ABC123' };

const CATALOG_VEHICLE = {
    vehicleType: 'car',
    year: '2021',
    makeId: 'vpic:448',
    make: 'Toyota',
    modelId: 'vpic:2469',
    model: 'Camry',
    color: 'SIL',
    licensePlateNumber: 'SMPL001',
    licensePlateRegion: 'US-MA',
    vin: '0SAMPLE0VIN000001',
    flags: ['commercial_branding'],
    catalog: {
        vehicleTypes: [{ value: 'car', label: 'Car' }],
        colors: [{ value: 'SIL', label: 'Silver' }],
        makes: [{ value: 'vpic:448', label: 'Toyota' }],
        models: [{ value: 'vpic:2469', label: 'Camry' }],
        plateRegions: [{ value: 'US-MA', label: 'Massachusetts (US-MA)' }],
        flags: [
            { value: 'salvage_title', label: 'Salvage title' },
            { value: 'commercial_branding', label: 'Commercial branding' },
        ],
    },
};

const BUSINESS = {
    storeTitle: 'Casa Nostra',
    description: 'Pasta',
    location: '1 Main St',
    line2: 'Suite 2',
    phoneNumber: '6175550100',
    email: 'hola@casanostra.com',
    website: 'casanostra.com',
    showTIN: true,
    tin: '12-3456789',
    legalName: 'Casa Nostra LLC',
    taxAddress: '9 Elm St, Boston',
    industries: [{ id: 'Restaurant', title: 'Restaurant' }],
};

const CHECKBOX_OPTIONS = [
    { value: 'photo', label: 'Photo' },
    { value: 'expiry', label: 'Expiry date', disabled: true },
];

const FREQUENCIES = [
    { interval: 'daily', title: 'Daily' },
    { interval: 'weekly', title: 'Weekly', description: 'Every Monday' },
    { interval: 'instant', title: 'Instant', disabled: true },
];

const noop = () => {};

const errorsOf = (field) => [{ field, code: 'invalid', message: 'Check this field' }];

/** @param {(file: string) => object} load @returns {Object<string, () => React.ReactElement>} */
export const appPathCases = (load) => {
    const component = (file) => load(file).default;
    return {
        'app path: Form.PersonInfo (editable, server errors)': () => {
            const PersonInfo = component('Form/FormPersonInfo');
            return <PersonInfo {...PERSON} errors={errorsOf('lastName')} inputActionHandler={noop} />;
        },
        'app path: Form.PersonInfo (isDisabled)': () => {
            const PersonInfo = component('Form/FormPersonInfo');
            return <PersonInfo {...PERSON} isDisabled inputActionHandler={noop} />;
        },
        'app path: Form.VehicleInfo (isDisabled)': () => {
            const VehicleInfo = component('Form/FormVehicleInfo');
            return <VehicleInfo {...LEGACY_VEHICLE} isDisabled inputActionHandler={noop} />;
        },
        'app path: Form.VehicleInfo (catalogue, editable, server errors)': () => {
            const VehicleInfo = component('Form/FormVehicleInfo');
            return <VehicleInfo {...CATALOG_VEHICLE} errors={errorsOf('vin')} inputActionHandler={noop} />;
        },
        'app path: Form.VehicleInfo (catalogue, isDisabled)': () => {
            const VehicleInfo = component('Form/FormVehicleInfo');
            return <VehicleInfo {...CATALOG_VEHICLE} isDisabled inputActionHandler={noop} />;
        },
        'app path: Form.BusinessInfo (editable, server errors)': () => {
            const BusinessInfo = component('Form/FormBusinessInfo');
            return <BusinessInfo {...BUSINESS} errors={errorsOf('tin')} inputActionHandler={noop} />;
        },
        'app path: Form.BusinessInfo (isDisabled)': () => {
            const BusinessInfo = component('Form/FormBusinessInfo');
            return <BusinessInfo {...BUSINESS} isDisabled inputActionHandler={noop} />;
        },
        'app path: Form.DriverInfo (sign-up, server errors)': () => {
            const DriverInfo = component('Form/FormDriverInfo');
            return (
                <DriverInfo
                    licenseNumer="D1234567"
                    dateOfBirth="01/02/90"
                    showSsn={false}
                    errors={errorsOf('licenseNumer')}
                    inputActionHandler={noop}
                />
            );
        },
        'app path: CheckboxListField (editable)': () => {
            const CheckboxListField = component('CheckboxListField/CheckboxListField');
            return (
                <CheckboxListField
                    label="Items"
                    options={CHECKBOX_OPTIONS}
                    values={['photo']}
                    onChange={noop}
                    error="Pick at least one"
                />
            );
        },
        'app path: CheckboxListField (disabled)': () => {
            const CheckboxListField = component('CheckboxListField/CheckboxListField');
            return <CheckboxListField label="Items" options={CHECKBOX_OPTIONS} values={['photo']} disabled />;
        },
        // `editable={false}` is an existing TextInput prop: alone it keeps the «show» toggle (review LO-3).
        'app path: SecretInputText (editable={false})': () => {
            const SecretInputText = component('Form/SecretInputText');
            return <SecretInputText mode="outlined" label="SSN" value="123456789" editable={false} />;
        },
        'app path: StripeForm.PaymentFrequency (payout frequency screen)': () => {
            const PaymentFrequency = component('StripeForm/StripeFormPaymentFrequency');
            return <PaymentFrequency options={FREQUENCIES} selectedInterval="weekly" inputActionHandler={noop} />;
        },
    };
};
