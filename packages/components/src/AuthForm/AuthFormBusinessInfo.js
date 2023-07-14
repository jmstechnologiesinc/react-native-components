import React from 'react';

import { TextInput, Caption } from '@jmstechnologiesinc/react-native-paper';

import ScreenWrapper from '../ScreenWrapper/ScreenWrapper';
import { localized } from '../Localization/Localization';
import IndustryPicker from './IndustryPicker';

const AuthFormBusinessInfo = ({
    isDisabled,
    title = localized('authForm.businessDetails'),
    description,
    storeTitle,
    fullAddress,
    line2,
    showWebsite = true,
    showPhone = true,
    website,
    phone,
    industryPlaceholder,
    inputActionHandler,
    industry,
}) => {
    return (
        <>
            <ScreenWrapper.Section title={title}>
                <TextInput
                    mode="outlined"
                    label={localized('authForm.storeName')}
                    value={storeTitle}
                    disabled={isDisabled}
                    onChangeText={(text) => inputActionHandler('title', text)}
                />
            </ScreenWrapper.Section>
            <ScreenWrapper.Section>
                <TextInput
                    mode="outlined"
                    label={localized('authForm.storehighlightsDescription')}
                    value={description}
                    disabled={isDisabled}
                    onChangeText={(text) => inputActionHandler('description', text)}
                />
            </ScreenWrapper.Section>
            <ScreenWrapper.Section>
                <TextInput
                    mode="outlined"
                    label={localized('authForm.storeAddress')}
                    value={fullAddress}
                    disabled={isDisabled}
                    onChangeText={(text) => inputActionHandler('fullAddress', text)}
                />
            </ScreenWrapper.Section>
            <ScreenWrapper.Section>
                <TextInput
                    mode="outlined"
                    label={localized('authForm.floorSuite')}
                    value={line2}
                    disabled={isDisabled}
                    onChangeText={(text) => inputActionHandler('line2', text)}
                />
            </ScreenWrapper.Section>
            {showPhone ? (
                <ScreenWrapper.Section>
                    <TextInput
                        mode="outlined"
                        label={localized('authForm.phoneNumber')}
                        value={phone}
                        disabled={isDisabled}
                        onChangeText={(text) => inputActionHandler('phone', text)}
                    />
                </ScreenWrapper.Section>
            ) : null}
            {showWebsite ? (
                <ScreenWrapper.Section>
                    <TextInput
                        mode="outlined"
                        label={localized('authForm.website')}
                        value={website}
                        disabled={isDisabled}
                        onChangeText={(text) => inputActionHandler('website', text)}
                    />
                    <Caption>{localized('authForm.noWebsiteInstructions')}</Caption>
                </ScreenWrapper.Section>
            ) : null}
            <ScreenWrapper.Section>
                <IndustryPicker
                    isDisabled={isDisabled}
                    placeholder={industryPlaceholder}
                    inputActionHandler={inputActionHandler}
                    industry={industry}
                />
            </ScreenWrapper.Section>
        </>
    );
};

export default AuthFormBusinessInfo;
