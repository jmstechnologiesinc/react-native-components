import React from 'react';

import { TextInput } from '@jmstechnologiesinc/react-native-paper';
import ScreenWrapper from '../ScreenWrapper';
import { localized } from '../Localization/Localization';
import { FieldErrorText, errorsOf } from '../Form/FormField';

const StripeFormAccountBank = ({
    accountHolder,
    bankAccountNumber,
    reenterAccountNumber,
    routingNumber,
    inputActionHandler,
    // The host's errors (`{ field, code, message }`, as the package's forms take them), each under its input. The
    // form validates nothing by itself.
    errors,
}) => {
    const hasError = (field) => errorsOf(errors, field).length > 0;

    return (
        <>
            <ScreenWrapper.Section>
                <TextInput
                    mode="outlined"
                    label={localized('accountHolder')}
                    value={accountHolder}
                    error={hasError('accountHolder')}
                    autoCapitalize="words"
                    onChangeText={(text) => inputActionHandler('accountHolder', text)}
                />
                <FieldErrorText field="accountHolder" errors={errors} />
            </ScreenWrapper.Section>
            <ScreenWrapper.Section>
                <TextInput
                    mode="outlined"
                    label={localized('routingNumber')}
                    value={routingNumber}
                    error={hasError('routingNumber')}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="number-pad"
                    onChangeText={(text) => inputActionHandler('routingNumber', text)}
                />
                <FieldErrorText field="routingNumber" errors={errors} />
            </ScreenWrapper.Section>
            <ScreenWrapper.Section>
                <TextInput
                    mode="outlined"
                    label={localized('bankAccountNumber')}
                    value={bankAccountNumber}
                    error={hasError('bankAccountNumber')}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="number-pad"
                    onChangeText={(text) => inputActionHandler('bankAccountNumber', text)}
                />
                <FieldErrorText field="bankAccountNumber" errors={errors} />
            </ScreenWrapper.Section>
            <ScreenWrapper.Section>
                <TextInput
                    mode="outlined"
                    label={localized('re-enterAccountNumber')}
                    value={reenterAccountNumber}
                    error={hasError('reenterAccountNumber')}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="number-pad"
                    onChangeText={(text) => inputActionHandler('reenterAccountNumber', text)}
                />
                <FieldErrorText field="reenterAccountNumber" errors={errors} />
            </ScreenWrapper.Section>
        </>
    );
};

export default StripeFormAccountBank;
