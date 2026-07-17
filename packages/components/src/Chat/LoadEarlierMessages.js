import React from 'react';

import { StyleSheet, View } from 'react-native';

import { ActivityIndicator, Button, MD3LightTheme } from '@jmstechnologiesinc/react-native-paper';

/**
 * The library's LoadEarlierMessages: the "load more" button at the top of the history. It
 * only shows when infinite scroll is off (isInfiniteScrollEnabled !== true); when on, the
 * load is triggered by onEndReached and the spinner alone is enough here.
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
