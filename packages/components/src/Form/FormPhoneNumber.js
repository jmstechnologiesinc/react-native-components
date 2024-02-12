import React, { useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';

import { Button, MD3LightTheme } from '@jmstechnologiesinc/react-native-paper';

import { PhoneInput } from '@jmstechnologiesinc/react-native-phone-input';


import { localized } from '../Localization/Localization'
import FormVerificationCode from './FormVerificationCode';
import ScreenWrapper from '../ScreenWrapper/ScreenWrapper';
import CountryPicker from './countryPicker';



const FormPhoneNumber = ({ onPhoneNumberPress }) => {
    const [countriesPickerData, setCountriesPickerData] = useState(null);

    const [confirm, setConfirm] = useState(null);
    const phoneRef = useRef();
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false)


    const actionSheetRef = useRef();

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
        setIsLoading(true)
        if (phoneRef.current.isValidNumber()) {
            const userValidPhoneNumber = phoneRef.current.getValue();
            const result = await onPhoneNumberPress(userValidPhoneNumber)
            setConfirm(result)
        } else {
            Alert.alert('', localized('pleaseValidPhoneNumber'), [{ text: 'OK' }], {
                cancelable: false,
            })

        }
        setIsLoading(false)
    };

    const onDismiss = () => {
        setConfirm(!confirm)
    }

    const onConfirmCode = async (code) => {
        setIsLoading(true)
        try {
            await confirm.confirm(code)
        } catch (error) {
            setIsError(true)
        }
        setIsLoading(false)
    };

    return (
        <>
            <ScreenWrapper.Section>
                <PhoneInput ref={phoneRef}
                    initialCountry={'us'}
                    onPressFlag={onPressFlag} />
            </ScreenWrapper.Section>

            <ScreenWrapper.Section>
                <Button mode='contained'
                    onPress={onPress}
                    style={{ marginTop: MD3LightTheme.spacing.x3 }}
                    loading={isLoading}
                    disabled={isLoading}

                > {localized('logIn')} </Button>
            </ScreenWrapper.Section>

            <FormVerificationCode
                confirm={confirm}
                onDismiss={onDismiss}
                onResendCode={onPress}
                onConfirmCode={onConfirmCode}
                isLoading={isLoading}
                isError={isError}
                onError={setIsError}

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
