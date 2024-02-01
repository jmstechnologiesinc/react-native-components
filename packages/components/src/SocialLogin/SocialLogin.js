import { Image } from 'react-native';
import React from 'react';
import ScreenWrapper from '../ScreenWrapper';
import { Button } from 'react-native-paper';

const SocialLogin = () => {
    return (
        <>
            <ScreenWrapper.Section>
                <Button
                    mode="outlined"
                    isCustomLoginButton={true}
                    onPress={() => navigation.navigate('SignupScreen')}
                    icon={({ size }) => (
                        <Image
                            source={require('./icon/mac-os-logo.png')}
                            style={{ width: size, height: size, borderRadius: size / 2 }}
                            accessibilityIgnoresInvertColors
                        />
                    )}
                >
                    Continue with Apple
                </Button>
            </ScreenWrapper.Section>
            <ScreenWrapper.Section>
                <Button
                    mode="outlined"
                    isCustomLoginButton={true}
                    onPress={() => navigation.navigate('SignupScreen')}
                    icon={({ size }) => (
                        <Image
                            source={require('./icon/googlebutton.png')}
                            style={{ width: size, height: size, borderRadius: size / 2 }}
                            accessibilityIgnoresInvertColors
                        />
                    )}
                >
                    Continue with Google
                </Button>
            </ScreenWrapper.Section>
            <ScreenWrapper.Section>
                <Button
                    mode="outlined"
                    isCustomLoginButton={true}
                    onPress={() => navigation.navigate('SignupScreen')}
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
                >
                    Continue with Facebook
                </Button>
            </ScreenWrapper.Section>
            <ScreenWrapper.Section>
                <Button
                    mode="outlined"
                    isCustomLoginButton={true}
                    onPress={() => navigation.navigate('SignupScreen')}
                    icon={({ size }) => (
                        <Image
                            source={require('./icon/phone-call.png')}
                            style={{ width: size, height: size, borderRadius: size / 2 }}
                            accessibilityIgnoresInvertColors
                        />
                    )}
                >
                    Continue with Phone Number
                </Button>
            </ScreenWrapper.Section>
        </>
    );
};

export default SocialLogin;
