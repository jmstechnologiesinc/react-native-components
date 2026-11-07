import React, { useState } from 'react';

import { EN, ES, VEHICLE_COLOR, VEHICLE_TYPE, statusLabelKey } from '@jmstechnologiesinc/partner';

export default {
    title: 'packages/AuthForm',
};

import * as AuthForm from './Form';
// import FormPhoneNumber from './FormPhoneNumber';

const state = {
    email: 'jms@gmail.com',
    password: '23322332',
    passwordConfirm: '233232332',
    firstName: 'Jose',
    lastName: 'Santos',
    phoneNumber: '8297872134',
    licenseNumer: '121212212',
    zipcode: '51000',
    dateofBirth: '12/2/1900',
    ssn: '12/2/1900',
    industries: 'Restaurant, clothes',
    storeTitle: 'Vaka Restaurant',
    storeAddress: 'Hata Mayor #12',
    make: 'Toyota',
    model: 'Camry',
    color: 'white',
    year: 1999,
};

export const AuthFormEmailPassword = () => (
    <AuthForm.EmailPassword email={state.email} password={state.password} inputActionHandler={() => {}} />
);

export const AuthFormConfirmPassword = () => (
    <AuthForm.EmailPassword
        email={state.email}
        password={state.password}
        passwordConfirm={state.passwordConfirm}
        inputActionHandler={() => {}}
        showConfirmPasswordInput={true}
    />
);

export const AuthFormResetPassword = () => (
    <AuthForm.EmailPassword
        email={state.email}
        password={state.password}
        passwordConfirm={state.passwordConfirm}
        inputActionHandler={() => {}}
        showResetPassword={true}
        onPasswordReset={() => {}}
    />
);

export const AuthFormEmailPasswordDisabled = () => (
    <AuthForm.EmailPassword
        email={state.email}
        password={state.password}
        passwordConfirm={state.passwordConfirm}
        inputActionHandler={() => {}}
        showConfirmPasswordInput={false}
        isEmailDisabled={true}
        isPasswordDisabled={true}
    />
);

export const AuthFormPersonInfo = () => (
    <AuthForm.PersonInfo
        firstName={state.firstName}
        lastName={state.lastName}
        phoneNumber={state.phoneNumber}
        inputActionHandler={() => {}}
    />
);

export const AuthFormDriverInfo = () => (
    <AuthForm.DriverInfo
        licenseNumer={state.licenseNumer}
        zipcode={state.zipcode}
        dateofBirth={state.dateofBirth}
        ssn={state.ssn}
        inputActionHandler={() => {}}
    />
);

export const AuthFormBusinessInfo = () => (
    <AuthForm.BusinessInfo
        title="Business Details"
        storeTitle={state.storeTitle}
        storeAddress={state.storeAddress}
        industries={state.industries}
        placeholder={['Restaurant', 'Pharmacy', 'Grocery']}
        inputActionHandler={() => {}}
    />
);

export const AuthFormCarInfo = () => (
    <AuthForm.CarInfo
        make={state.make}
        model={state.model}
        color={state.color}
        year={state.year}
        inputActionHandler={() => {}}
    />
);

export const PhoneNumber = () => <AuthForm.PhoneNumber phoneNumber={state.password} inputActionHandler={() => {}} />;

// C-25 — how the partner console shows a partner's data: nothing editable, and
// the fields a pending change touches marked as changed.
export const PersonInfoReadOnlyHighlighted = () => (
    <AuthForm.PersonInfo
        firstName={state.firstName}
        lastName={state.lastName}
        email={state.email}
        phoneNumber={state.phoneNumber}
        readOnly
        highlightFields={['lastName', 'phoneNumber']}
        inputActionHandler={() => {}}
    />
);

export const VehicleInfoReadOnlyHighlighted = () => (
    <AuthForm.VehicleInfo
        make={state.make}
        model={state.model}
        color={state.color}
        year={String(state.year)}
        licensePlateNumber="ABC-1234"
        readOnly
        highlightFields={['color', 'licensePlateNumber']}
        inputActionHandler={() => {}}
    />
);

// C-22 — the vehicle form with the catalogue, as the app's VehicleView feeds it: types and colors labelled from the
// partner package's catalogue in each language, makes and models as a catalogue slice lists them.
const vehicleCatalogIn = (texts) => {
    const labelled = (group, vocabulary) =>
        Object.values(vocabulary).map((value) => ({ value, label: texts[statusLabelKey(group, value)] ?? value }));
    return {
        vehicleTypes: labelled('vehicle_type', VEHICLE_TYPE),
        colors: labelled('vehicle_color', VEHICLE_COLOR),
        makes: [
            { value: 'vpic:448', label: 'Toyota' },
            { value: 'vpic:474', label: 'Honda' },
        ],
        models: [
            { value: 'vpic:2469', label: 'Camry' },
            { value: 'vpic:2208', label: 'Corolla' },
        ],
    };
};

const VehicleInfoWithCatalog = ({ texts }) => {
    const [vehicle, setVehicle] = useState({
        vehicleType: VEHICLE_TYPE.CAR,
        year: '2021',
        makeId: 'vpic:448',
        make: 'Toyota',
        modelId: 'vpic:2469',
        model: 'Camry',
        color: VEHICLE_COLOR.SIL,
        licensePlateNumber: 'SMPL001',
        licensePlateRegion: 'US-MA',
    });
    return (
        <AuthForm.VehicleInfo
            {...vehicle}
            catalog={vehicleCatalogIn(texts)}
            inputActionHandler={(field, value) => setVehicle((current) => ({ ...current, [field]: value }))}
        />
    );
};

export const VehicleInfoCatalogEn = () => <VehicleInfoWithCatalog texts={EN} />;

export const VehicleInfoCatalogEs = () => <VehicleInfoWithCatalog texts={ES} />;

// A pending change as the reviewer sees it: read-only, the changed fields marked, a server error under its field.
export const VehicleInfoCatalogReadOnly = () => (
    <AuthForm.VehicleInfo
        vehicleType={VEHICLE_TYPE.CAR}
        year="2021"
        makeId="vpic:448"
        make="Toyota"
        modelId="vpic:2469"
        model="Camry"
        color={VEHICLE_COLOR.SIL}
        licensePlateNumber="SMPL001"
        licensePlateRegion="US-MA"
        vin="0SAMPLE0VIN000001"
        catalog={vehicleCatalogIn(EN)}
        readOnly
        highlightFields={['color', 'vin']}
        errors={[{ field: 'vin', code: 'vin_check_digit', message: 'The VIN check digit does not match' }]}
        inputActionHandler={() => {}}
    />
);

export const BusinessInfoHighlighted = () => (
    <AuthForm.BusinessInfo
        storeTitle={state.storeTitle}
        location={state.storeAddress}
        industries={[]}
        highlightFields={['title', 'industries']}
        inputActionHandler={() => {}}
    />
);

// The driver's answers as a reviewer sees them: read-only (no disclosure, the
// secrets masked), a changed field marked and a server error under its field.
export const DriverInfoReadOnly = () => (
    <AuthForm.DriverInfo
        licenseNumer="D1234567"
        dateOfBirth="01/02/90"
        ssn="123456789"
        readOnly
        highlightFields={['dateofBirth']}
        errors={[{ field: 'licenseNumer', code: 'expired', message: 'The license has expired' }]}
        inputActionHandler={() => {}}
    />
);
