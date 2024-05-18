
import React from 'react';

import { Button, TextInput, Portal, Dialog, HelperText, Text, MD3LightTheme, ProgressBar, MD3Colors } from '@jmstechnologiesinc/react-native-paper';

import { localized } from '../Localization/Localization'
import { StyleSheet } from 'react-native';

import ScreenWrapper from '../ScreenWrapper';

export const PHONE_NUMBER_VERIFICATION_CODE_LENGTH = 6;
export function isValidPhoneNumberVerificationCode(code) {
    return code?.length === PHONE_NUMBER_VERIFICATION_CODE_LENGTH;
}

const FormVerificationCode = ({
    isVisible,
    isLoading,
    error,
    onResendCodePress,
    onDismiss,
    onConfirmCodePress,
}) => {
    return (
        <Portal>
            <Dialog
                visible={isVisible}
                dismissable={false}>
                <Dialog.Title>{localized('verificationCodeModalTitle')}</Dialog.Title>
                <Dialog.ScrollArea style={styles.container}>
                    <Dialog.Content>
                        {isLoading ? (
                            <ProgressBar
                                indeterminate
                                style={{ marginTop: MD3LightTheme.spacing.x6 }} />
                        ) : (
                            <>
                                <ScreenWrapper.Section>
                                    <Text>{localized("enterTheVerificationCode")}</Text>
                                </ScreenWrapper.Section>
                                <ScreenWrapper.Section>
                                    <TextInput
                                        textContentType="oneTimeCode"
                                        autocomplete="one-time-code"
                                        keyboardType="numeric"
                                        maxlength={PHONE_NUMBER_VERIFICATION_CODE_LENGTH}
                                        onChangeText={(text) => {
                                            if (isValidPhoneNumberVerificationCode(text)) {
                                                onConfirmCodePress(text)
                                            }
                                        }}
                                    />
                                    {error ? (
                                        <HelperText type="error" visible={true}>
                                            {error}
                                        </HelperText>
                                    ) : null}
                                </ScreenWrapper.Section>

                                <Button
                                    onPress={onResendCodePress}
                                    disabled={isLoading}
                                    style={{ flexDirection: 'row' }}>
                                    {localized('resendCode')}
                                </Button>
                            </>
                        )}
                    </Dialog.Content>
                </Dialog.ScrollArea>
                <Dialog.Actions>
                    <Button
                        onPress={onDismiss}
                        textColor={MD3Colors.error50}>
                        {localized('cancel')}
                    </Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 0,
    },
});

export default FormVerificationCode