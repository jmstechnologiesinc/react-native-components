import React from 'react';
import ScreenWrapper from '../ScreenWrapper';
import { Button } from '@jmstechnologiesinc/react-native-paper';
import { MATERIAL_ICONS } from '@jmstechnologiesinc/commons';
import { localized } from '../Localization/Localization';

const SocialAuthentication = ({ isAppleLoading, isGoogleLoading, onApplePress, onGooglePress, onFacebookPress }) => {
    return (
        <>
            <ScreenWrapper.Section>
                <Button
                    loading={isAppleLoading}
                    disabled={isAppleLoading}
                    mode="outlined"
                    onPress={onApplePress}
                    icon={MATERIAL_ICONS.apple}
                >
                    {localized('continueApple')}
                </Button>
            </ScreenWrapper.Section>
            <ScreenWrapper.Section>
                <Button
                    loading={isGoogleLoading}
                    disabled={isGoogleLoading}
                    mode="outlined"
                    onPress={onGooglePress}
                    icon={MATERIAL_ICONS.google}
                >
                    {localized('continueGoogle')}
                </Button>
            </ScreenWrapper.Section>
            {/* <ScreenWrapper.Section>
                <Button
                    mode="outlined"
                    onPress={onFacebookPress}
                    icon={MATERIAL_ICONS.facebook}
                >
                    {localized('continueFacebook')}
                </Button>
            </ScreenWrapper.Section> */}
        </>
    );
};

export default SocialAuthentication;
