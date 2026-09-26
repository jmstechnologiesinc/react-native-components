import React from 'react';
import { List } from '@jmstechnologiesinc/react-native-paper';
import * as JMSList from '../List/List';
import ScreenWrapper from '../ScreenWrapper';

// `readOnly` (additive): every option disabled and `inputActionHandler` never
// called — the payout interval shown, not chosen (the partner console).
const StripeFormPaymentFrequency = ({ options, inputActionHandler, selectedInterval, readOnly = false }) => (
    <ScreenWrapper.Section>
        <List.Section>
            {options?.map(({ title, interval, description, disabled }, index) => (
                <JMSList.CheckRadio
                    key={index}
                    title={title}
                    description={description}
                    isDisabled={readOnly || disabled}
                    isChecked={selectedInterval === interval}
                    onPress={() => {
                        if (!readOnly) {
                            inputActionHandler('interval', interval);
                        }
                    }}
                />
            ))}
        </List.Section>
    </ScreenWrapper.Section>
);
export default StripeFormPaymentFrequency;
