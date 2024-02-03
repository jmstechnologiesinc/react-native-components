import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, Platform, ScrollView, Alert } from 'react-native';

import { List, Button, MD3LightTheme } from '@jmstechnologiesinc/react-native-paper';
import ActionSheet, { useScrollHandlers } from 'react-native-actions-sheet';

import PhoneInput from '@jmstechnologiesinc/react-native-phone-input';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHeaderHeight } from '@react-navigation/elements';

import { localized } from '../Localization/Localization'
import FormVerificationCode from './FormVerificationCode';
import ScreenWrapper from '../ScreenWrapper/ScreenWrapper';


const WINDOW_HEIGHT = Dimensions.get('window').height;

const FormPhoneNumber = ({ onPressSend }) => {
    const [countriesPickerData, setCountriesPickerData] = useState(null);

    const [confirm, setConfirm] = useState(null);
    const phoneRef = useRef();

    const actionSheetRef = useRef();
    const insets = useSafeAreaInsets();
    const scrollHandlers = useScrollHandlers('scrollview-1', actionSheetRef);
    const HEADER_HEIGHT = useHeaderHeight();
    const actionSheetHeight = Platform.OS === 'ios' ? WINDOW_HEIGHT - HEADER_HEIGHT : null;

    useEffect(() => {
        if (phoneRef && phoneRef.current) {
            setCountriesPickerData(phoneRef.current.getPickerData());

        }
    }, [phoneRef]);

    const onPressFlag = () => {
        actionSheetRef.current.show();
    };

    const selectCountry = (country) => {
        phoneRef.current.selectCountry(country.iso2);
        actionSheetRef.current.hide();
    };


    const onPress = async () => {
        if (phoneRef.current.isValidNumber()) {
            const userValidPhoneNumber = phoneRef.current.getValue();
            const result = await onPressSend(userValidPhoneNumber)
            setConfirm(result)
        } else {
            Alert.alert('', localized('pleaseValidPhoneNumber'), [{ text: 'OK' }], {
                cancelable: false,
            })
        }
    };

    return (
        <>
            <ScreenWrapper.Section>
                <PhoneInput ref={phoneRef} initialCountry={'us'} onPressFlag={onPressFlag} />
            </ScreenWrapper.Section>

            <ScreenWrapper.Section>
                <Button mode='contained' onPress={onPress} style={{ marginTop: MD3LightTheme.spacing.x3 }}> {localized('logIn')} </Button>
            </ScreenWrapper.Section>

            <FormVerificationCode
                confirm={confirm}
            />

            <ActionSheet
                ref={actionSheetRef}
                statusBarTranslucent={true}
                drawUnderStatusBar={false}
                springOffset={50}
                defaultOverlayOpacity={0.3}
                gestureEnabled
                containerStyle={{
                    paddingBottom: insets.bottom,
                    height: actionSheetHeight,
                }}
            >

                <ScrollView {...scrollHandlers}>
                    {countriesPickerData?.map((item) => (
                        <ScreenWrapper.Container>
                            <List.Item
                                title={item.label}
                                key={item.key}
                                onPress={() => selectCountry(item)}
                                left={() => <List.Image variant="flag" source={item.image} />}
                            />
                        </ScreenWrapper.Container>
                    ))}
                </ScrollView>
            </ActionSheet>
        </>
    );
};

export default FormPhoneNumber;
