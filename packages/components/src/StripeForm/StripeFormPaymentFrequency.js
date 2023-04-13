import React from 'react';
import { RadioButton, List} from '@jmsstudiosinc/react-native-paper';
import * as JMSList from '../List/List';
import ScreenWrapper from '../ScreenWrapper/ScreenWrapper';
import { selectPaymentFrequency} from './utils'

const StripeFormPaymentFrequency = ({ inputActionHandler, methodsPayments,setMethodsPayments}) => {
    return (
       <ScreenWrapper.Section>
            <List.Section>
                {methodsPayments?.map(({ title, selected, description }, index) => (
                    <JMSList.CheckRadio
                        key={index}
                        title={title}
                        description={description}
                        variant = 'radio'
                        isDisabledOnPress={true}
                        disabled={true}
                        left={(props) =>
                            selected !== undefined ? (
                                <RadioButton.Android
                                    {...props}
                                    status={selected ? 'checked' : 'unchecked'}
                                    onPress={() =>  selectPaymentFrequency(index, methodsPayments, setMethodsPayments, inputActionHandler)}
                                />
                            ) : null
                        }
                    />
                     
                ))}
            </List.Section>
          </ScreenWrapper.Section>
         

        
    );
}
export default StripeFormPaymentFrequency