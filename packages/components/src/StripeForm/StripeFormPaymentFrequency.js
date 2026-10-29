import React from 'react';
import { View } from 'react-native';
import { List } from '@jmstechnologiesinc/react-native-paper';
import * as JMSList from '../List/List';
import CheckedRow from '../ListRow/CheckedRow';
import ScreenWrapper from '../ScreenWrapper';

// `readOnly` (additive): the payout interval shown, not chosen (the partner
// console). Every option is a `CheckedRow` in a `list` named `accessibilityLabel`,
// the selected one with a check and announced «<title>, <description>,
// selected»; nothing is pressable or greyed out and `inputActionHandler` is
// never called. Without it, the radios the app has always had.
const StripeFormPaymentFrequency = ({
    options,
    inputActionHandler,
    selectedInterval,
    readOnly = false,
    accessibilityLabel,
}) => (
    <ScreenWrapper.Section>
        <List.Section>
            {readOnly ? (
                <View role="list" aria-label={accessibilityLabel}>
                    {options?.map(({ title, interval, description }, index) => (
                        <CheckedRow
                            key={index}
                            title={title}
                            description={description}
                            checked={selectedInterval === interval}
                            titleNumberOfLines={0}
                            descriptionNumberOfLines={0}
                        />
                    ))}
                </View>
            ) : (
                options?.map(({ title, interval, description, disabled }, index) => (
                    <JMSList.CheckRadio
                        key={index}
                        title={title}
                        description={description}
                        isDisabled={disabled}
                        isChecked={selectedInterval === interval}
                        onPress={() => inputActionHandler('interval', interval)}
                    />
                ))
            )}
        </List.Section>
    </ScreenWrapper.Section>
);
export default StripeFormPaymentFrequency;
