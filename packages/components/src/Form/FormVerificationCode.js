
import React, { useState } from 'react';

import { Button, TextInput, Portal, Dialog, HelperText, Text } from '@jmstechnologiesinc/react-native-paper';

import { localized } from '../Localization/Localization'
import { StyleSheet } from 'react-native';



import ScreenWrapper from '../ScreenWrapper';

const FormVerificationCode = ({
    isVisible,
    isLoading,
    error,
    onResendCodePress,
    onDismiss,
    onConfirmCodePress,
}) => {
    const [code, setCode] = useState(null)
    return (
        <Portal>
            <Dialog
                visible={isVisible}
                dismissable={false}>
                <Dialog.Title>{localized('verificationCodeModalTitle')}</Dialog.Title>

                <Dialog.ScrollArea style={styles.container}>
                    <Dialog.Content>
                        <ScreenWrapper.Section>
                            <Text>{localized("enterTheVerificationCode")}</Text>
                        </ScreenWrapper.Section>
                        <ScreenWrapper.Section>
                            <TextInput
                                autoFocus
                                textContentType="oneTimeCode"
                                autocomplete="one-time-code"
                                maxlength="6"
                                onChangeText={(text) => {
                                    setCode(text)
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
                    </Dialog.Content>
                </Dialog.ScrollArea>

                <Dialog.Actions>
                    <Button onPress={onDismiss}>
                        {localized('cancel')}
                    </Button>
                    <Button
                        loading={isLoading}
                        disabled={isLoading}
                        onPress={() => onConfirmCodePress(code)} >
                        {localized('confirmCode')}
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