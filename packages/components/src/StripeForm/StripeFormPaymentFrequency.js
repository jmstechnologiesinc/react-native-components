import React from 'react';
import { List, Checkbox } from '@jmsstudiosinc/react-native-paper';
import * as JMSList from '../List/List';
import ScreenWrapper from '../ScreenWrapper/ScreenWrapper';
import { selectPaymentFrequency } from './utils';

const StripeFormPaymentFrequency = ({ inputActionHandler, paymentMethods, onChange }) => {
    return (
        <ScreenWrapper.Section>
            <List.Section>
                {paymentMethods?.map(({ title, selected, description }, index) => (
                    <JMSList.CheckRadio
                        key={index}
                        title={title}
                        description={description}
                        rippleColor="transparent"
                        left={(props) =>
                            selected !== undefined ? (
                                <Checkbox.Android
                                    {...props}
                                    status={selected ? 'checked' : 'unchecked'}
                                    rippleColor="transparent"
                                    onPress={() =>
                                        selectPaymentFrequency(index, paymentMethods, onChange, inputActionHandler)
                                    }
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
