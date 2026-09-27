import React, { useState } from 'react';

import { Paragraph, TextInput } from '@jmstechnologiesinc/react-native-paper';

import ScreenWrapper from '../ScreenWrapper';
import { localized } from '../Localization/Localization';
import { handleDateOfBirhtChange } from './utils';
import SecretInputText from './SecretInputText';
import FormField, { isHighlighted } from './FormField';

import { Config } from '../Config';

// C-25 — `readOnly`, `highlightFields` and `errors` as on the other forms,
// keyed by the names this form reports to `inputActionHandler`:
// `licenseNumer`, `dateofBirth`, `ssn`. Without them it renders exactly as
// before (pinned by `__tests__/legacyRendering.test.js`).
//
// `readOnly` locks every field and drops the background-check disclosure,
// which is addressed to the applicant, not to whoever reviews the answers, and
// the date field's entry aids (placeholder, keypad, length), which describe
// typing. The secrets stay masked: a disabled input offers no «show» toggle. `dateOfBirth`
// seeds the date field (it keeps its own state while typed into, as before).
//
// Additive, for a reader that must never see more than it is given (canon
// §9.14): `showSsn={false}` drops the SSN field altogether (the console never
// shows it, K-18), and `secureLicenseNumber={false}` shows the licence value as
// it arrives — a server-masked `•••• 1234` whose last four a secure entry would
// hide again.
const FormDriverInfo = ({
    licenseNumer,
    ssn,
    dateOfBirth: initialDateOfBirth,
    inputActionHandler,
    readOnly = false,
    highlightFields,
    errors,
    showSsn = true,
    secureLicenseNumber = true,
}) => {
    const [dateOfBirth, setDateOfBirth] = useState(initialDateOfBirth ?? '');
    const locked = readOnly ? { disabled: true } : null;

    return (
        <>
            {readOnly ? null : (
                <ScreenWrapper.Section>
                    <Paragraph>
                        {`${localized('grantingNewDriverAccess')} ${Config.LEGAL_ENTITY_NAME} ${localized(
                            'checkrBackgroundChecks'
                        )}`}
                    </Paragraph>
                </ScreenWrapper.Section>
            )}

            <ScreenWrapper.Section>
                <FormField
                    input={SecretInputText}
                    field="licenseNumer"
                    errors={errors}
                    highlighted={isHighlighted(highlightFields, 'licenseNumer')}
                    mode="outlined"
                    label={localized('driverLicenseNumber')}
                    value={licenseNumer}
                    onChangeText={(text) => inputActionHandler('licenseNumer', text)}
                    {...(secureLicenseNumber ? null : { secureTextEntry: false })}
                    {...locked}
                />
            </ScreenWrapper.Section>
            <ScreenWrapper.Section>
                <FormField
                    input={TextInput}
                    field="dateofBirth"
                    errors={errors}
                    highlighted={isHighlighted(highlightFields, 'dateofBirth')}
                    mode="outlined"
                    label={localized('dateBirth')}
                    {...(readOnly ? null : { placeholder: 'MM/DD/YY' })}
                    value={readOnly && initialDateOfBirth !== undefined ? initialDateOfBirth : dateOfBirth}
                    {...(readOnly ? null : { keyboardType: 'numeric', maxLength: 10 })}
                    onChangeText={(text) =>
                        handleDateOfBirhtChange(text, inputActionHandler, setDateOfBirth, dateOfBirth)
                    }
                    {...locked}
                />
            </ScreenWrapper.Section>
            {showSsn ? (
                <ScreenWrapper.Section>
                    <FormField
                        input={SecretInputText}
                        field="ssn"
                        errors={errors}
                        highlighted={isHighlighted(highlightFields, 'ssn')}
                        mode="outlined"
                        label={localized('socialSecurityNumber')}
                        value={ssn}
                        onChangeText={(text) => inputActionHandler('ssn', text)}
                        {...locked}
                    />
                </ScreenWrapper.Section>
            ) : null}
        </>
    );
};

export default FormDriverInfo;
