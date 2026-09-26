import React from 'react';
import { View } from 'react-native';

import { Button, Provider } from '@jmstechnologiesinc/react-native-paper';

import { SnackbarProvider, useSnackbar } from './Snackbar';

export default {
    title: 'packages/Snackbar',
};

const Buttons = () => {
    const { show } = useSnackbar();
    return (
        <View>
            <Button onPress={() => show('Saved')}>Show one</Button>
            <Button onPress={() => ['First saved', 'Second saved', 'Third saved'].forEach((text) => show(text))}>
                Queue three
            </Button>
            <Button onPress={() => show('Archived', { action: { label: 'Undo', onPress: () => {} } })}>
                With an action
            </Button>
        </View>
    );
};

export const Queue = () => (
    <Provider>
        <SnackbarProvider>
            <View style={{ height: 320 }}>
                <Buttons />
            </View>
        </SnackbarProvider>
    </Provider>
);
