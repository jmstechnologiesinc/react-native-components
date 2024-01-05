import React from 'react';
import ActionSheet from 'react-native-actions-sheet';
import { List, RadioButton } from '@jmstechnologiesinc/react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { localized } from '../Localization/Localization';
import ButtonWrapper from '../ButtonWrapper/ButtonWrapper';

const ActionPaymentSheet = ({
    paymentMethods,
    onChange,
    actionSheetRef,
    selectedPaymentMethodId,
    onAddPaymentMethod,
}) => {
    const insets = useSafeAreaInsets();
    return (
        <>
            <ActionSheet
                ref={actionSheetRef}
                statusBarTranslucent={true}
                drawUnderStatusBar={true}
                springOffset={50}
                defaultOverlayOpacity={0.3}
                gestureEnabled
                containerStyle={{
                    paddingBottom: insets.bottom,
                }}
            >
                <List.Section>
                    {paymentMethods?.map(({ last4, brand, id }) => {
                        return (
                            <List.Item
                                title={last4}
                                description={brand}
                                left={(props) => <List.Icon {...props} icon="credit-card" />}
                                right={(props) => (
                                    <RadioButton.Android
                                        {...props}
                                        status={selectedPaymentMethodId === id ? 'checked' : 'unchecked'}
                                        onPress={() => {
                                            onChange(id);
                                            actionSheetRef.current.hide();
                                        }}
                                    />
                                )}
                                onPress={() => {
                                    onChange(id);
                                    actionSheetRef.current.hide();
                                }}
                            />
                        );
                    })}
                </List.Section>
                <ButtonWrapper title={localized('addNewPaymentMethod')} onPress={onAddPaymentMethod} />
            </ActionSheet>
        </>
    );
};

export default ActionPaymentSheet;
