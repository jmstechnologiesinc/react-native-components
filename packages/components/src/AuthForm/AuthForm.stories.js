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
        labelDriver="Driver's license numer"
        labelZipCode="Zip code"
        labelDateBirth="Date of Birth"
        labelSsn="Social Security Number"
        firstName={state.firstName}
        lastName={state.lastName}
        phone={state.phone}
        licenseNumer={state.licenseNumer}
        zipcode={state.zipcode}
        dateofBirth={state.dateofBirth}
        ssn={state.ssn}
        inputActionHandler={() => {}}
    />
);

export const AuthFormDriverInfo = () => (
    <AuthForm.DriverInfo
        title="Before granting new drivers to access the platform, JMS uses Checkr as its third-party provider to run secure background checks. to ensure safety and security of all members of its platform."
        labelFirstName="First Name"
        labelLastName="Last Name"
        labelPhone="Phone Number"
        labelDriver="Driver's license numer"
        labelZipCode="Zip code"
        labelDateBirth="Date of Birth"
        labelSsn="Social Security Number"
        firstName={state.firstName}
        lastName={state.lastName}
        phone={state.phone}
        licenseNumer={state.licenseNumer}
        zipcode={state.zipcode}
        dateofBirth={state.dateofBirth}
        ssn={state.ssn}
        inputActionHandler={() => {}}
    />
);
