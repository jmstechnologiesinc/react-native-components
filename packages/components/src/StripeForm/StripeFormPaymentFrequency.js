import React from 'react';
import { List, Checkbox } from '@jmstechnologiesinc/react-native-paper';
import * as JMSList from '../List/List';
import ScreenWrapper from '../ScreenWrapper/ScreenWrapper';

const StripeFormPaymentFrequency = ({ options, inputActionHandler, selectedInterval }) => {
    return (
        <ScreenWrapper.Section>
            <List.Section>
                {options?.map(({ title, interval, description, disabled }, index) => (
                    <JMSList.CheckRadio
                        key={index}
                        title={title}
                        description={description}
                        rippleColor="transparent"
                        disabled={disabled}
                        onPress={() => {
                            inputActionHandler('interval', interval);
                        }}
                        left={(props) => (
                            <Checkbox.Android
                                {...props}
                                disabled={disabled}
                                status={selectedInterval === interval ? 'checked' : 'unchecked'}
                                rippleColor="transparent"
                                onPress={() => {
                                    inputActionHandler('interval', interval);
                                }}
                            />
                        )}
                    />
                ))}
            </List.Section>
        </ScreenWrapper.Section>
    );
};
export default StripeFormPaymentFrequency;
