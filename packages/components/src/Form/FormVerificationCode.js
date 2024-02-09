
import React, { useState } from 'react';

import { Button, TextInput,  Portal, Dialog, HelperText } from '@jmstechnologiesinc/react-native-paper';

import { localized } from '../Localization/Localization'

const FormVerificationCode = ({ confirm, onDismiss }) => {

    const [code, setCode] = useState(null);
    const [error, setError] = useState(false)
    const [isLoading, setIsLoading] = useState(false);

    const confirmCode = async () => {
        setIsLoading(true)
        try {
            await confirm.confirm(code);
        } catch (error) {
            setError(true)
        }
        setIsLoading(false)
    };

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
                            setError(false)
                        }}
                    />
                    {error ? (
                        <HelperText type="error" visible={true}>
                            {localized('helpTextPasscodeIncorrect')}
                        </HelperText>
                    ) : null}
                </Dialog.Content>
                <Dialog.Actions>
                    <Button 
                        onPress={confirmCode} >
                        {localized('resendCode')}
                    </Button>
                    <Button 
                        loading={isLoading}
                        disabled={isLoading}
                        mode='contained' 
                        onPress={confirmCode} >
                        {localized('confirmCode')}
                    </Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    )
}

export default FormVerificationCode