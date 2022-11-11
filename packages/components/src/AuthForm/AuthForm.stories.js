import React from 'react';

export default {
    title: 'packages/AuthForm',
};

import * as AuthForm from './AuthForm';

const state = { email: 'jms@gmail.com', password: '23322332', passwordConfirm: '233232332' };

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
