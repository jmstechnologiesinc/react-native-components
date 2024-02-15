import React, { useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';

import { Button, HelperText, MD3LightTheme } from '@jmstechnologiesinc/react-native-paper';

import { PhoneInput } from '@jmstechnologiesinc/react-native-phone-input';

import { localized } from '../Localization/Localization'
import FormVerificationCode from './FormVerificationCode';
import ScreenWrapper from '../ScreenWrapper/ScreenWrapper';
import CountryPicker from './CountryPicker';

const FormPhoneNumber = ({ 
    isVerificationCodeVisible,
    isVereficationCodeLoading,
    isLoading,
    vereficationCodeError,
    onPhoneNumberLoginPress,
    onDismiss,
    onResendCodePress,
    onConfirmCodePress
 }) => {
    const phoneRef = useRef();
    const actionSheetRef = useRef();

    const [countriesPickerData, setCountriesPickerData] = useState(null);

    useEffect(() => {
        if (phoneRef?.current) {
            setCountriesPickerData(phoneRef.current.getPickerData());
        }
    }, [phoneRef]);

    const onFlagPress = () => {
        actionSheetRef.current.show();
    };

    const selectCountry = (country) => {
        phoneRef.current.selectCountry(country.iso2);
        actionSheetRef.current.hide();
    };

    const onPress = () => {
        if (phoneRef.current.isValidNumber()) {
            onPhoneNumberLoginPress(phoneRef.current.getValue());
        } else {
            Alert.alert('', localized('pleaseValidPhoneNumber'), [{ text: 'OK' }], {
                cancelable: false,
            })
        }
    };

    const resendVerificationCode = () => {
        onResendCodePress(phoneRef.current.getValue());
    }

    return (
        <>
            <ScreenWrapper.Section>
                {phoneRef ? (
                    <PhoneInput ref={phoneRef}
                        initialCountry='us'
                        onPressFlag={onFlagPress} />
                )  : null}
            </ScreenWrapper.Section>

            <ScreenWrapper.Section>
                <Button mode='contained'
                    onPress={onPress}
                    loading={isLoading}
                    disabled={isLoading}> 
                    {localized('logIn')} 
                </Button>
            </ScreenWrapper.Section>
            <HelperText style={{ marginBottom: MD3LightTheme.spacing.x2 }}>{localized('signInPhoneVerificationCodeAgreement')}</HelperText>

            <FormVerificationCode
                isVisible={isVerificationCodeVisible}
                isLoading={isVereficationCodeLoading}
                error={vereficationCodeError}
                onDismiss={onDismiss}
                onResendCodePress={resendVerificationCode}
                onConfirmCodePress={onConfirmCodePress}
            />
            
            <CountryPicker
                ref={actionSheetRef}
                data={countriesPickerData}
                onSelect={selectCountry}
            />
        </>
    );
};

export default FormPhoneNumber;
