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
    industry: 'Restaurant, clothes',
    storeTitle: 'Vaka Restaurant',
    storeAddress: 'Hata Mayor #12',
};

export const AuthFormEmailPassword = () => (
    <AuthForm.EmailPassword
        labelEmail="Email"
        labelPassword="Password"
        email={state.email}
        password={state.password}
        inputActionHandler={() => {}}
    />
);

export const AuthFormConfirmPassword = () => (
    <AuthForm.EmailPassword
        labelEmail="Email"
        labelPassword="Password"
        labelConfirmPassword="Confirm Password"
        email={state.email}
        password={state.password}
        passwordConfirm={state.passwordConfirm}
        inputActionHandler={() => {}}
        confirmPassword={true}
    />
);

export const AuthFormResetPassword = () => (
    <AuthForm.EmailPassword
        title="Contact Details"
        labelEmail="Email"
        labelPassword="Password"
        email={state.email}
        password={state.password}
        passwordConfirm={state.passwordConfirm}
        inputActionHandler={() => {}}
        resetPassword={true}
        buttonTitle={'Reset password'}
        onPasswordReset={() => {}}
    />
);

export const AuthFormEmailPasswordDisabled = () => (
    <AuthForm.EmailPassword
        labelEmail="Email"
        labelPassword="Password"
        labelConfirmPassword="Confirm Password"
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
        title="Contact Details"
        labelFirstName="First Name"
        labelLastName="Last Name"
        labelPhone="Phone Number"
        firstName={state.firstName}
        lastName={state.lastName}
        phone={state.phone}
        inputActionHandler={() => {}}
    />
);

export const AuthFormDriverInfo = () => (
    <AuthForm.DriverInfo
        title="Before granting new drivers to access the platform, JMS uses Checkr as its third-party provider to run secure background checks. to ensure safety and security of all members of its platform."
        labelDriver="Driver's license numer"
        labelZipCode="Zip code"
        labelDateBirth="Date of Birth"
        labelSsn="Social Security Number"
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
        labelStoreName="Store Name"
        labelAddress="Full Store Address"
        labelIndustry="Industry"
        storeTitle={state.storeTitle}
        storeAddress={state.storeAddress}
        industry={state.industry}
        placeholder={['Restaurant', 'Pharmacy', 'Grocery']}
        inputActionHandler={() => {}}
    />
);
