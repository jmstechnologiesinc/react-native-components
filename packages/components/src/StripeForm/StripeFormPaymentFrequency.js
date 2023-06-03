import React from 'react';
import { List, Checkbox } from '@jmsstudiosinc/react-native-paper';
import * as JMSList from '../List/List';
import ScreenWrapper from '../ScreenWrapper/ScreenWrapper';

const StripeFormPaymentFrequency = ({ inputActionHandler, payoutFrequency, selectedPayoutFrequency, onChange }) => {
    return (
        <ScreenWrapper.Section>
            <List.Section>
                {payoutFrequency?.map(({ title, selected, description, value, disabled }, index) => (
                    <JMSList.CheckRadio
                        key={index}
                        title={title}
                        description={description}
                        rippleColor="transparent"
                        onPress={() => {
                            onChange(value), inputActionHandler('payoutsSchedule', value);
                        }}
                        left={(props) =>
                            selected !== undefined ? (
                                <Checkbox.Android
                                    {...props}
                                    disabled={disabled}
                                    status={selectedPayoutFrequency === value ? 'checked' : 'unchecked'}
                                    rippleColor="transparent"
                                    onPress={() => {
                                        onChange(value), inputActionHandler('payoutsSchedule', value);
                                    }}
                                />
                            ) : null
                        }
                    />
                ))}
            </List.Section>
        </ScreenWrapper.Section>
    );
};
export default StripeFormPaymentFrequency;
