
import React, { useState } from 'react';

import { Button, TextInput, MD3LightTheme, Portal, Dialog, HelperText } from '@jmstechnologiesinc/react-native-paper';

import { localized } from '../Localization/Localization'

const FormVerificationCode = ({ confirm }) => {

    const [code, setCode] = useState(null);
    const [error, setError] = useState(false)

    const confirmCode = async () => {
        try {
            await confirm.confirm(code);
        } catch (error) {
            setError(true)

        }
    };

    return (
        <Portal>
            <Dialog visible={confirm} >
                <Dialog.Title>{localized('EnterCodeSendYou')}</Dialog.Title>
                <Dialog.Content>
                    <TextInput
                        autoFocus
                        onChangeText={(text) => {
                            setCode(text)
                            setError(false)
                        }}
                    />
                    <HelperText type="error" visible={error}>
                        {localized('helpTextPasscodeIncorrect')}
                    </HelperText>
                    <Button mode='contained' onPress={confirmCode} style={{ marginTop: MD3LightTheme.spacing.x4 }}>{localized('confirmCode')}</Button>
                </Dialog.Content>

            </Dialog>
        </Portal>

    )
}

export default FormVerificationCode