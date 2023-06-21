import React from 'react';
import ActionSheet from 'react-native-actions-sheet';
import { List, RadioButton, Button } from '@/react-native-paper';
import { MATERIAL_ICONS } from '@/commons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScreenWrapper from '../ScreenWrapper/ScreenWrapper';
import { localized } from '@/react-native-components';

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
                <ScreenWrapper.Section withPaddingHorizontal style={{ flexDirection: 'row' }}>
                    <Button icon={MATERIAL_ICONS.increment} onPress={() => onAddPaymentMethod()}>
                        {localized('Add new payment method')}
                    </Button>
                </ScreenWrapper.Section>
            </ActionSheet>
        </>
    );
};

export default ActionPaymentSheet;
