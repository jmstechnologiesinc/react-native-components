import React from 'react';

import { TextInput, Caption } from '@jmstechnologiesinc/react-native-paper';

import ScreenWrapper from '../ScreenWrapper/ScreenWrapper';
import { localized } from '../Localization/Localization';
import IndustryPicker from './IndustryPicker';

const AuthFormBusinessInfo = ({
    isDisabled,
    title = localized('Business details'),
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
                    label={localized('Store name')}
                    value={storeTitle}
                    disabled={isDisabled}
                    onChangeText={(text) => inputActionHandler('title', text)}
                />
            </ScreenWrapper.Section>
            <ScreenWrapper.Section>
                <TextInput
                    mode="outlined"
                    label={localized('Store highlights / description')}
                    value={description}
                    disabled={isDisabled}
                    onChangeText={(text) => inputActionHandler('description', text)}
                />
            </ScreenWrapper.Section>
            <ScreenWrapper.Section>
                <TextInput
                    mode="outlined"
                    label={localized('Store address')}
                    value={fullAddress}
                    disabled={isDisabled}
                    onChangeText={(text) => inputActionHandler('fullAddress', text)}
                />
            </ScreenWrapper.Section>
            <ScreenWrapper.Section>
                <TextInput
                    mode="outlined"
                    label={localized('Floor / Suite')}
                    value={line2}
                    disabled={isDisabled}
                    onChangeText={(text) => inputActionHandler('line2', text)}
                />
            </ScreenWrapper.Section>
            {showPhone ? (
                <ScreenWrapper.Section>
                    <TextInput
                        mode="outlined"
                        label={localized('Phone Number')}
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
                        label={localized('Website')}
                        value={website}
                        disabled={isDisabled}
                        onChangeText={(text) => inputActionHandler('website', text)}
                    />
                    <Caption>
                        {localized(
                            'do-not-have-a-website'
                        )}
                    </Caption>
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
