import React, { useEffect, useRef, useState } from 'react';

import { TextInput } from '@jmstechnologiesinc/react-native-paper';
import { PhoneInput } from '@jmstechnologiesinc/react-native-phone-input';
import ScreenWrapper from '../ScreenWrapper/ScreenWrapper';
import { localized } from '../Localization/Localization';
import CountryPicker from './countryPicker'


const FormPersonInfo = ({ isDisabled, firstName, inputActionHandler, lastName, phone, email, phoneInput = false, currentPhone }) => {
    const [countriesPickerData, setCountriesPickerData] = useState(null);
    const actionSheetRef = useRef();

    const phoneRef = useRef();

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
            <ScreenWrapper.Section title={localized('contactDetails')}>
                <TextInput
                    mode="outlined"
                    label={localized('firstName')}
                    value={firstName}
                    disabled={isDisabled}
                    onChangeText={(text) => inputActionHandler('firstName', text)}
                />
            </ScreenWrapper.Section>
            <ScreenWrapper.Section>
                <TextInput
                    mode="outlined"
                    label={localized('lastName')}
                    value={lastName}
                    disabled={isDisabled}
                    onChangeText={(text) => inputActionHandler('lastName', text)}
                />
            </ScreenWrapper.Section>

            {
                phoneInput ?
                    <>
                        <ScreenWrapper.Section>
                            <TextInput
                                mode='outlined'
                                label={localized('email')}
                                value={email}
                                onChangeText={(email) => inputActionHandler('email', email)}
                            />
                        </ScreenWrapper.Section>

                        <ScreenWrapper.Section>
                            <PhoneInput
                                variant="outlined"
                                ref={phoneRef}
                                initialCountry={'us'}
                                onPressFlag={onPressFlag}
                                inputActionHandler={inputActionHandler}
                                initialValue={currentPhone}
                            />
                        </ScreenWrapper.Section>
                    </>
                    :
                    <ScreenWrapper.Section>
                        <TextInput
                            mode="outlined"
                            label={localized('phoneNumber')}
                            value={phone}
                            disabled={isDisabled}
                            keyboardType="numeric"
                            onChangeText={(text) => inputActionHandler('phone', text)}
                        />
                    </ScreenWrapper.Section>
            }

            <CountryPicker
                ref={actionSheetRef}
                data={countriesPickerData}
                onSelect={selectCountry}
            />

        </>
    );
};

export default FormPersonInfo;
