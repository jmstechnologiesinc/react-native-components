import React, { useRef } from 'react';
import ActionSheet from 'react-native-actions-sheet';
import { List, RadioButton, Button } from '@jmsstudiosinc/react-native-paper';
import { MATERIAL_ICONS } from '@jmsstudiosinc/commons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScreenWrapper from '../ScreenWrapper/ScreenWrapper';
import { localized } from '@jmsstudiosinc/react-native-components';
import { showActionSheet, hideActionSheet, onUpdateValue } from './utils';

const ActionPaymentSheet = ({ paymentMethods, apiStripeRef, setPaymentMethods }) => {
    const insets = useSafeAreaInsets();
    const actionSheetRef = useRef();
    return (
        <>
            {paymentMethods && paymentMethods.filter((item) => item.selected).length > 0 ? (
                paymentMethods
                    .filter((item) => item.selected)
                    .map(({ last4, brand }) => {
                        return (
                            <List.Item
                                title={last4}
                                description={brand}
                                titleNumberOfLines={0}
                                descriptionNumberOfLines={0}
                                left={(props) => <List.Icon {...props} icon="credit-card" />}
                                right={(props) => <List.Icon {...props} icon={MATERIAL_ICONS.chevron} />}
                                onPress={() => showActionSheet(actionSheetRef)}
                            />
                        );
                    })
            ) : (
                <List.Item
                    title={'Add payment method'}
                    description={'No payment method has been added.'}
                    titleNumberOfLines={0}
                    descriptionNumberOfLines={0}
                    left={(props) => <List.Icon {...props} icon="credit-card" />}
                    right={(props) => <List.Icon {...props} icon={MATERIAL_ICONS.chevron} />}
                    onPress={() =>
                        apiStripeRef.current.openPaymentSheet(() =>
                            apiStripeRef.current.getPaymentMethod((data) => {
                                setPaymentMethods(data);
                            })
                        )
                    }
                />
            )}

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
                    {paymentMethods?.map(({ last4, brand, selected }, id) => {
                        return (
                            <List.Item
                                title={last4}
                                description={brand}
                                left={(props) => <List.Icon {...props} icon="credit-card" />}
                                right={(props) => (
                                    <RadioButton.Android
                                        {...props}
                                        status={selected ? 'checked' : 'unchecked'}
                                        onPress={() => {
                                            onUpdateValue(paymentMethods, id, setPaymentMethods);
                                            hideActionSheet(actionSheetRef);
                                        }}
                                    />
                                )}
                                onPress={() => {
                                    onUpdateValue(paymentMethods, id, setPaymentMethods);
                                    hideActionSheet(actionSheetRef);
                                }}
                            />
                        );
                    })}
                </List.Section>
                <ScreenWrapper.Section withPaddingHorizontal style={{ flexDirection: 'row' }}>
                    <Button
                        icon={MATERIAL_ICONS.increment}
                        onPress={() => {
                            const isCheckoutScreen = true;
                            apiStripeRef.current.openPaymentSheet(
                                () =>
                                    apiStripeRef.current.getPaymentMethod((data) => {
                                        setPaymentMethods(data);
                                    }),
                                () => hideActionSheet(actionSheetRef),
                                isCheckoutScreen
                            );
                        }}
                    >
                        {localized('Add new payment method')}
                    </Button>
                </ScreenWrapper.Section>
            </ActionSheet>
        </>
    );
};

export default ActionPaymentSheet;
