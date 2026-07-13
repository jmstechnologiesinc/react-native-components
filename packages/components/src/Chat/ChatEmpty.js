import React from 'react';

import { StyleSheet, View } from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { MD3LightTheme, Text, useTheme } from '@jmstechnologiesinc/react-native-paper';

/**
 * Estado vacío. Va dentro de la FlatList (ListEmptyComponent), que está invertida: por eso
 * lleva scaleY: -1, para no salir del revés.
 */
const ChatEmpty = ({ isInverted = true, label = 'Aún no hay mensajes' }) => {
    const theme = useTheme();

    return (
        <View style={[styles.container, isInverted && styles.inverted]}>
            <MaterialCommunityIcons
                name="message-outline"
                size={40}
                color={theme.colors.onSurfaceVariant}
                style={styles.icon}
            />
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                {label}
            </Text>
        </View>
    );
};

const { spacing } = MD3LightTheme;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.x12,
    },
    inverted: {
        transform: [{ scaleY: -1 }],
    },
    // Sin opacity: quien atenúa en MD3 es el color (onSurfaceVariant), no la transparencia.
    icon: {
        marginBottom: spacing.x2,
    },
});

export default ChatEmpty;
