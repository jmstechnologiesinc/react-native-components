import React from 'react';
import { List } from '@jmstechnologiesinc/react-native-paper';
import * as JMSList from '../List/List';
import ScreenWrapper from '../ScreenWrapper/ScreenWrapper';

const StripeFormPaymentFrequency = ({ options, inputActionHandler, selectedInterval }) => (
    <ScreenWrapper.Section>
        <List.Section>
            {options?.map(({ title, interval, description, disabled }, index) => (
                <JMSList.CheckRadio
                    key={index}
                    title={title}
                    description={description}
                    isDisabled={disabled}
                    isChecked={selectedInterval === interval}
                    onPress={() => {
                        inputActionHandler('interval', interval);
                    }}
                />
            ))}
        </List.Section>
    </ScreenWrapper.Section>
);
export default StripeFormPaymentFrequency;
