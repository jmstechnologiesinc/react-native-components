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
                    label={localized('Account holder')}
                    value={accountHolder}
                    onChangeText={(text) => inputActionHandler('accountHolder', text)}
                />
            </ScreenWrapper.Section>
            <ScreenWrapper.Section>
                <TextInput
                    mode="outlined"
                    label={localized('Routing number')}
                    value={routingNumber}
                    onChangeText={(text) => inputActionHandler('routingNumber', text)}
                />
            </ScreenWrapper.Section>
            <ScreenWrapper.Section>
                <TextInput
                    mode="outlined"
                    label={localized('Bank account number')}
                    value={bankAccountNumber}
                    onChangeText={(text) => inputActionHandler('bankAccountNumber', text)}
                />
            </ScreenWrapper.Section>
            <ScreenWrapper.Section>
                <TextInput
                    mode="outlined"
                    label={localized('Re-enter account number')}
                    value={reenterAccountNumber}
                    onChangeText={(text) => inputActionHandler('reenterAccountNumber', text)}
                />
            </ScreenWrapper.Section>
        </>
    );
};

export default StripeFormAccountBank;
