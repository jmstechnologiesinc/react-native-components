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
                    onChangeText={(text) => inputActionHandler('accountHolder', text)}
                />
            </ScreenWrapper.Section>
            <ScreenWrapper.Section>
                <TextInput
                    mode="outlined"
                    label={localized('routingNumber')}
                    value={routingNumber}
                    onChangeText={(text) => inputActionHandler('routingNumber', text)}
                />
            </ScreenWrapper.Section>
            <ScreenWrapper.Section>
                <TextInput
                    mode="outlined"
                    label={localized('bankAccountNumber')}
                    value={bankAccountNumber}
                    onChangeText={(text) => inputActionHandler('bankAccountNumber', text)}
                />
            </ScreenWrapper.Section>
            <ScreenWrapper.Section>
                <TextInput
                    mode="outlined"
                    label={localized('re-enterAccountNumber')}
                    value={reenterAccountNumber}
                    onChangeText={(text) => inputActionHandler('reenterAccountNumber', text)}
                />
            </ScreenWrapper.Section>
        </>
    );
};

export default StripeFormAccountBank;
