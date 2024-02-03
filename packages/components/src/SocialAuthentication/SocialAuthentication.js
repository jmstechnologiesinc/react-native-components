import { Image, Platform } from 'react-native';
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
                    icon={({ size }) => (
                        <Image
                            source={require('./icon/mac-os-logo.png')}
                            style={{ width: size, height: size, borderRadius: size / 2 }}
                            accessibilityIgnoresInvertColors
                        />
                    )}
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
                    icon={({ size }) => (
                        <Image
                            source={require('./icon/googlebutton.png')}
                            style={{ width: size, height: size, borderRadius: size / 2 }}
                            accessibilityIgnoresInvertColors
                        />
                    )}
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
                    icon={({ size }) => (
                        <Image
                            source={require('./icon/facebook.png')}
                            style={{
                                width: size,
                                height: size,
                                borderRadius: size / 2,
                                flexDirection: 'row',
                            }}
                            accessibilityIgnoresInvertColors
                        />

                    )}
                    style={{ marginTop: MD3LightTheme.spacing.x3 }}
                >
                    {localized('continueFacebook')}
                </Button>
            </ScreenWrapper.Section>

        </>
    );
};

export default SocialAuthentication;
