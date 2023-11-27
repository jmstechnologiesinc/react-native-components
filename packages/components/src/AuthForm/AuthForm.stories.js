import React from 'react';

export default {
    title: 'packages/AuthForm',
};

import * as AuthForm from './AuthForm';

const state = {
    email: 'jms@gmail.com',
    password: '23322332',
    passwordConfirm: '233232332',
    firstName: 'Jose',
    lastName: 'Santos',
    phone: '8297872134',
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
        confirmPassword={true}
    />
);

export const AuthFormResetPassword = () => (
    <AuthForm.EmailPassword
        email={state.email}
        password={state.password}
        passwordConfirm={state.passwordConfirm}
        inputActionHandler={() => {}}
        resetPassword={true}
        onPasswordReset={() => {}}
    />
);

export const AuthFormEmailPasswordDisabled = () => (
    <AuthForm.EmailPassword
        email={state.email}
        password={state.password}
        passwordConfirm={state.passwordConfirm}
        inputActionHandler={() => {}}
        confirmPassword={false}
        isEmailDisabled={true}
        isPasswordDisabled={true}
    />
);

export const AuthFormPersonInfo = () => (
    <AuthForm.PersonInfo
        firstName={state.firstName}
        lastName={state.lastName}
        phone={state.phone}
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
