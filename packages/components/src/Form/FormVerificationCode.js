
import React, { useState } from 'react';

import { Button, TextInput, Portal, Dialog, HelperText } from '@jmstechnologiesinc/react-native-paper';

import { localized } from '../Localization/Localization'

const FormVerificationCode = ({ confirm, onDismiss, onResendCode, onConfirmCode,
    isLoading, isError, onError, isLoadingResend }) => {
    const [code, setCode] = useState(null);

    return (
        <Portal>
            <Dialog visible={confirm}
                onDismiss={onDismiss}
            >
                <Dialog.Title>{localized('EnterCodeSendYou')}</Dialog.Title>
                <Dialog.Content>
                    <TextInput
                        autoFocus
                        onChangeText={(text) => {
                            setCode(text)
                            onError(false)
                        }}
                    />
                    {isError ? (
                        <HelperText type="error" visible={true}>
                            {localized('helpTextPasscodeIncorrect')}
                        </HelperText>
                    ) : null}
                </Dialog.Content>
                <Dialog.Actions>
                    <Button
                        onPress={onResendCode}
                        loading={isLoadingResend}
                        disabled={isLoadingResend}
                    >
                        {localized('resendCode')}
                    </Button>
                    <Button
                        loading={isLoading}
                        disabled={isLoading}
                        onPress={() => onConfirmCode(code)} >
                        {localized('confirmCode')}
                    </Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    )
}

export default FormVerificationCode