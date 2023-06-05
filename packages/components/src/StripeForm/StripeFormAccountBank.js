import React from 'react';

import { TextInput } from '@jmsstudiosinc/react-native-paper';
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
                    label={localized('Account Holder')}
                    value={accountHolder}
                    onChangeText={(text) => inputActionHandler('accountHolder', text)}
                />
            </ScreenWrapper.Section>
            <ScreenWrapper.Section>
                <TextInput
                    mode="outlined"
                    label={localized('Routing Number')}
                    value={routingNumber}
                    onChangeText={(text) => inputActionHandler('routingNumber', text)}
                />
            </ScreenWrapper.Section>
            <ScreenWrapper.Section>
                <TextInput
                    mode="outlined"
                    label={localized('Bank Account Number')}
                    value={bankAccountNumber}
                    onChangeText={(text) => inputActionHandler('bankAccountNumber', text)}
                />
            </ScreenWrapper.Section>
            <ScreenWrapper.Section>
                <TextInput
                    mode="outlined"
                    label={localized('Re-enter Account Number')}
                    value={reenterAccountNumber}
                    onChangeText={(text) => inputActionHandler('reenterAccountNumber', text)}
                />
            </ScreenWrapper.Section>
        </>
    );
};

export default StripeFormAccountBank;
