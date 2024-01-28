import React, { useEffect, useRef, useState } from 'react';

import { TextInput, Button, List } from '@jmstechnologiesinc/react-native-paper';
import ScreenWrapper from '../ScreenWrapper/ScreenWrapper';
import { localized } from '../Localization/Localization';
import * as JMS from '../List/List';

import ActionSheet, { useScrollHandlers } from 'react-native-actions-sheet';
import { Image } from 'react-native';

import PhoneInput from 'react-native-phone-input';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { useHeaderHeight } from '@react-navigation/elements';
import { Dimensions, Platform, ScrollView } from 'react-native';
import { moderateScale } from '@jmstechnologiesinc/react-native-size-matters';

const WINDOW_HEIGHT = Dimensions.get('window').height;

const FormPhoneNumber = ({ phone, inputActionHandler }) => {
    const [countriesPickerData, setCountriesPickerData] = useState(null);

    const phoneRef = useRef();

    const actionSheetRef = useRef();
    const insets = useSafeAreaInsets();
    const scrollHandlers = useScrollHandlers('scrollview-1', actionSheetRef);
    // const HEADER_HEIGHT = useHeaderHeight();
    // const actionSheetHeight = Platform.OS === 'ios' ? WINDOW_HEIGHT - HEADER_HEIGHT : null;

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

    return (
        <>
            <ScreenWrapper.Section>
                <PhoneInput ref={phoneRef} initialCountry={'us'} onPressFlag={onPressFlag} />

                <ActionSheet
                    ref={actionSheetRef}
                    statusBarTranslucent={true}
                    drawUnderStatusBar={false}
                    springOffset={50}
                    defaultOverlayOpacity={0.3}
                    gestureEnabled
                    containerStyle={{
                        paddingBottom: insets.bottom,
                        // height: actionSheetHeight,
                    }}
                >
                    <ScrollView {...scrollHandlers}>
                        {countriesPickerData?.map((item) => (
                            <ScreenWrapper.Container>
                                <List.Item
                                    title={item.label}
                                    onPress={() => selectCountry(item)}
                                    left={(size) => <List.Image variant="flag" source={item.image} />}
                                />
                            </ScreenWrapper.Container>
                        ))}
                    </ScrollView>
                </ActionSheet>
            </ScreenWrapper.Section>
        </>
    );
};

export default FormPhoneNumber;
