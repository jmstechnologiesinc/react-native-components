import React from 'react';

import { TextInput, Caption } from '@jmsstudiosinc/react-native-paper';

import ScreenWrapper from '../ScreenWrapper/ScreenWrapper';
import { localized } from '../Localization/Localization';
import SelectIndustries from './SelectIndustries';

const AuthFormBusinessInfo = ({ title, fullAddress, line2, website, industryPlaceholder, inputActionHandler, industry }) => {
    
    return (
        <>
            <ScreenWrapper.Section  title={localized('Business Details')}>
                <TextInput
                    mode="outlined"
                    label={localized('Store Name')}
                    value={title}
                    onChangeText={(text) => inputActionHandler('title', text)}
                />
            </ScreenWrapper.Section>
            <ScreenWrapper.Section>
                <TextInput
                    mode="outlined"
                    label={localized('Store Address')}
                    value={fullAddress}
                    onChangeText={(text) => inputActionHandler('fullAddress', text)}
                />
            </ScreenWrapper.Section>
            <ScreenWrapper.Section>
                <TextInput
                    mode="outlined"
                    label={localized('Floor / Suite')}
                    value={line2}
                    onChangeText={(text) => inputActionHandler('line2', text)}
                />
            </ScreenWrapper.Section>
            <ScreenWrapper.Section>
                <TextInput
                    mode="outlined"
                    label={localized('Website')}
                    value={website}
                    onChangeText={(text) => inputActionHandler('website', text)}
                />
                <Caption>
                    {localized(
                        'If you don’t have a website, enter a social media page, LinkedIn, or other relevant link.'
                    )}
                </Caption>
            </ScreenWrapper.Section>
            <ScreenWrapper.Section>
                <SelectIndustries placeholder={industryPlaceholder} inputActionHandler={inputActionHandler} industry={industry} />
            </ScreenWrapper.Section>
        </>
    );
};

export default AuthFormBusinessInfo;
