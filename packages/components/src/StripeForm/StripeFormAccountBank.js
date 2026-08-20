import React from 'react';

import { TextInput } from '@jmstechnologiesinc/react-native-paper';
import ScreenWrapper from '../ScreenWrapper/ScreenWrapper';
import { localized } from '../Localization/Localization';

const StripeFormAccountBank = ({
    accountHolder,
    bankAccountNumber,
    reenterAccountNumber,
    routingNumber,
    inputActionHandler,
}) => {
    return (
        <>
            <ScreenWrapper.Section>
                <TextInput
                    mode="outlined"
                    label={localized('accountHolder')}
                    value={accountHolder}
                    autoCapitalize="words"
                    onChangeText={(text) => inputActionHandler('accountHolder', text)}
                />
            </ScreenWrapper.Section>
            <ScreenWrapper.Section>
                <TextInput
                    mode="outlined"
                    label={localized('routingNumber')}
                    value={routingNumber}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="number-pad"
                    onChangeText={(text) => inputActionHandler('routingNumber', text)}
                />
            </ScreenWrapper.Section>
            <ScreenWrapper.Section>
                <TextInput
                    mode="outlined"
                    label={localized('bankAccountNumber')}
                    value={bankAccountNumber}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="number-pad"
                    onChangeText={(text) => inputActionHandler('bankAccountNumber', text)}
                />
            </ScreenWrapper.Section>
            <ScreenWrapper.Section>
                <TextInput
                    mode="outlined"
                    label={localized('re-enterAccountNumber')}
                    value={reenterAccountNumber}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="number-pad"
                    onChangeText={(text) => inputActionHandler('reenterAccountNumber', text)}
                />
            </ScreenWrapper.Section>
        </>
    );
};

export default StripeFormAccountBank;
