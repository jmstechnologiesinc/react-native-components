import React from 'react';

import { StyleSheet, View } from 'react-native';

import { ActivityIndicator, Button, MD3LightTheme } from '@jmstechnologiesinc/react-native-paper';

/**
 * LoadEarlierMessages de la librería: el botón de "cargar más" que se pinta al principio del
 * historial. Solo aparece cuando el scroll infinito está desactivado
 * (loadEarlierMessagesProps.isInfiniteScrollEnabled !== true); si está activo, la carga la
 * dispara onEndReached y aquí basta con el spinner.
 *
 * loadEarlierMessagesProps: { isAvailable, isLoading, isInfiniteScrollEnabled, onPress }
 */
const LoadEarlierMessages = ({ loadEarlierMessagesProps, label = 'Cargar mensajes antiguos' }) => {
    const { isAvailable, isLoading, isInfiniteScrollEnabled, onPress } = loadEarlierMessagesProps ?? {};

    if (!isAvailable) {
        return null;
    }

    if (isLoading) {
        return <ActivityIndicator style={styles.loading} />;
    }

    if (isInfiniteScrollEnabled) {
        return null;
    }

    return (
        <View style={styles.container}>
            <Button mode="outlined" compact onPress={onPress}>
                {label}
            </Button>
        </View>
    );
};

const { spacing } = MD3LightTheme;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginVertical: spacing.x3,
    },
    loading: {
        marginVertical: spacing.x3,
    },
});

export default LoadEarlierMessages;
