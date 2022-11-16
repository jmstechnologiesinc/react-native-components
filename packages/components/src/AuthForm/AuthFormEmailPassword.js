import React, { useState } from 'react';

import { TextInput } from '@jmsstudiosinc/react-native-paper';
import ScreenWrapper from '../ScreenWrapper/ScreenWrapper';

const AuthFormEmailPassword = ({
    email,
    password,
    isEmailDisabled = false,
    isPasswordDisabled = false,
    confirmPassword = false,
    labelEmail,
    labelPassword,
    inputActionHandler,
    labelConfirmPassword,
    passwordConfirm,
    isPassword = true,
}) => {
    const [isTextSecureEntry, setIsTextSecureEntry] = useState(true);

    return (
        <>
            <ScreenWrapper.Section>
                <TextInput
                    label={labelEmail}
                    value={email}
                    onChangeText={(email) => inputActionHandler('email', email)}
                    disabled={isEmailDisabled}
                />
            </ScreenWrapper.Section>

            {isPassword && (
                <ScreenWrapper.Section>
                    <TextInput
                        label={labelPassword}
                        value={password}
                        onChangeText={(password) => inputActionHandler('password', password)}
                        disabled={isPasswordDisabled}
                        secureTextEntry={isTextSecureEntry}
                        right={
                            <TextInput.Icon
                                name={isTextSecureEntry ? 'eye' : 'eye-off'}
                                onPress={() => setIsTextSecureEntry(!isTextSecureEntry)}
                            />
                        }
                    />
                </ScreenWrapper.Section>
            )}

            {confirmPassword && (
                <ScreenWrapper.Section>
                    <TextInput
                        label={labelConfirmPassword}
                        value={passwordConfirm}
                        onChangeText={(passwordConfirm) => inputActionHandler('passwordConfirm', passwordConfirm)}
                        disabled={isPasswordDisabled}
                        secureTextEntry={isTextSecureEntry}
                        right={
                            <TextInput.Icon
                                name={isTextSecureEntry ? 'eye' : 'eye-off'}
                                onPress={() => setIsTextSecureEntry(!isTextSecureEntry)}
                            />
                        }
                    />
                </ScreenWrapper.Section>
            )}
        </>
    );
};

export default AuthFormEmailPassword;
