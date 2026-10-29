import React from 'react';

import { HelperText } from '@jmstechnologiesinc/react-native-paper';
import ScreenWrapper from '../ScreenWrapper';
import { localized } from '../Localization/Localization';

import FormField, { isHighlighted } from './FormField';

const FormPersonInfo = ({
    firstName,
    lastName,
    phoneNumber,
    email,
    isDisabled,
    readOnly = false,
    highlightFields,
    errors,
    showFirstNameValidationError = true,
    showLastNameValidationError = true,
    showPhoneInput = true,
    showEmailInput = true,
    inputActionHandler,
}) => {
    // `readOnly` (the console) shows the values without letting them change; it is
    // not `isDisabled` (the app), which greys the fields out.
    const disabled = Boolean(isDisabled);

    return (
        <>
            <ScreenWrapper.Section title={localized('contactDetails')}>
                <FormField
                    mode="outlined"
                    field="firstName"
                    errors={errors}
                    highlighted={isHighlighted(highlightFields, 'firstName')}
                    disabled={disabled}
                    readOnly={readOnly}
                    error={showFirstNameValidationError && !firstName}
                    label={localized('firstName')}
                    value={firstName}
                    autoCapitalize="words"
                    onChangeText={(text) => inputActionHandler('firstName', text)}
                />
                {showFirstNameValidationError && !firstName ? (
                    <HelperText type="error" padding="none" visible={true}>
                        {localized('firstNameIsRequired')}
                    </HelperText>
                ) : null}
            </ScreenWrapper.Section>
            <ScreenWrapper.Section>
                <FormField
                    mode="outlined"
                    field="lastName"
                    errors={errors}
                    highlighted={isHighlighted(highlightFields, 'lastName')}
                    disabled={disabled}
                    readOnly={readOnly}
                    error={showLastNameValidationError && !lastName}
                    label={localized('lastName')}
                    value={lastName}
                    autoCapitalize="words"
                    onChangeText={(text) => inputActionHandler('lastName', text)}
                />
                {showLastNameValidationError && !lastName ? (
                    <HelperText type="error" padding="none" visible={true}>
                        {localized('lastNameIsRequired')}
                    </HelperText>
                ) : null}
            </ScreenWrapper.Section>

            {showEmailInput ? (
                <ScreenWrapper.Section>
                    <FormField
                        mode="outlined"
                        field="email"
                        errors={errors}
                        highlighted={isHighlighted(highlightFields, 'email')}
                        // The email has never followed `isDisabled`, and the app relies on
                        // that; only `readOnly` locks it.
                        readOnly={readOnly}
                        label={localized('email')}
                        value={email}
                        autoCapitalize="none"
                        autoCorrect={false}
                        keyboardType="email-address"
                        textContentType="emailAddress"
                        onChangeText={(email) => inputActionHandler('email', email)}
                    />
                </ScreenWrapper.Section>
            ) : null}

            {showPhoneInput ? (
                <ScreenWrapper.Section>
                    <FormField
                        mode="outlined"
                        field="phoneNumber"
                        errors={errors}
                        highlighted={isHighlighted(highlightFields, 'phoneNumber')}
                        disabled={disabled}
                        readOnly={readOnly}
                        label={localized('phoneNumber')}
                        value={phoneNumber}
                        keyboardType="numeric"
                        onChangeText={(text) => inputActionHandler('phoneNumber', text)}
                    />
                </ScreenWrapper.Section>
            ) : null}
        </>
    );
};

export default FormPersonInfo;
