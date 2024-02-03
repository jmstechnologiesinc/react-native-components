
import React from 'react';
import ScreenWrapper from '@jmstechnologiesinc/react-native-components/lib/ScreenWrapper';
import { Button, MD3LightTheme } from '@jmstechnologiesinc/react-native-paper';
import { localized } from '../Localization/Localization';

const SocialAuthentication = ({ onApplePress,
    onGooglePress,
    onFacebookPress }) => {
    return (
        <>

            <ScreenWrapper.Section>
                <Button
                    mode="outlined"
                    onPress={onApplePress}
                    icon={'apple'}
                    style={{ marginTop: MD3LightTheme.spacing.x3 }}
                >
                    {localized('continueApple')}
                </Button>
            </ScreenWrapper.Section>
            <ScreenWrapper.Section>
                <Button
                    mode="outlined"
                    isCustomLoginButton={true}
                    onPress={onGooglePress}
                    icon={'google'}
                    style={{ marginTop: MD3LightTheme.spacing.x3 }}
                >
                    {localized('continueGoogle')}

                </Button>
            </ScreenWrapper.Section>
            <ScreenWrapper.Section>
                <Button
                    mode="outlined"
                    isCustomLoginButton={true}
                    onPress={onFacebookPress}
                    icon={"facebook"}
                    style={{ marginTop: MD3LightTheme.spacing.x3 }}
                >
                    {localized('continueFacebook')}
                </Button>
            </ScreenWrapper.Section>

        </>
    );
};

export default SocialAuthentication;
