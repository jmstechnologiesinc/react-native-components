import React from 'react';

import { StyleSheet, View } from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { MD3LightTheme, Text, useTheme } from '@jmstechnologiesinc/react-native-paper';
import { moderateScale } from '@jmstechnologiesinc/react-native-size-matters';

/**
 * Estado vacío. Va dentro de la FlatList (ListEmptyComponent), que está invertida.
 *
 * La contra-inversión NO se hace aquí. VirtualizedList clona este elemento inyectándole en
 * `style` el transform exacto de su plataforma — y no es el mismo: en iOS invierte con
 * {scaleY: -1} pero en Android con {scale: -1}, ambos ejes. Un scaleY: -1 propio encima de
 * eso se anulaba en iOS y en Android dejaba un {scaleX: -1} neto: el "Aún no hay mensajes"
 * salía en espejo. Basta con aplicar el `style` que llega.
 */
const ChatEmpty = ({ label = 'Aún no hay mensajes', style }) => {
    const theme = useTheme();

    return (
        <View style={[styles.container, style]}>
            <MaterialCommunityIcons
                name="message-outline"
                size={(moderateScale(40))}
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
    // Sin opacity: quien atenúa en MD3 es el color (onSurfaceVariant), no la transparencia.
    icon: {
        marginBottom: spacing.x2,
    },
});

export default ChatEmpty;
