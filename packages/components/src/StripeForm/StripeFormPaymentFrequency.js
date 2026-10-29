import React from 'react';
import { View } from 'react-native';
import { List } from '@jmstechnologiesinc/react-native-paper';
import * as JMSList from '../List/List';
import ListRow from '../ListRow/ListRow';
import { localized } from '../Localization/Localization';
import ScreenWrapper from '../ScreenWrapper';

const checkIcon = <List.Icon icon="check" />;

// `readOnly` (additive): the payout interval shown, not chosen (the partner
// console). Every option is a `ListRow` in a `list` named `accessibilityLabel`,
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
                        <ListRow
                            key={index}
                            title={title}
                            description={description}
                            titleNumberOfLines={0}
                            descriptionNumberOfLines={0}
                            trailing={selectedInterval === interval ? checkIcon : null}
                            accessibilityLabel={
                                selectedInterval === interval
                                    ? [title, description, localized('selected')].filter(Boolean).join(', ')
                                    : undefined
                            }
                            inset={false}
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
