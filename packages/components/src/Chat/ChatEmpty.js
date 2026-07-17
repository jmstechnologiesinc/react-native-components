import React from 'react';

import { StyleSheet, View } from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { MD3LightTheme, Text, useTheme } from '@jmstechnologiesinc/react-native-paper';
import { moderateScale } from '@jmstechnologiesinc/react-native-size-matters';

/**
 * Empty state. Rendered inside the inverted FlatList (ListEmptyComponent).
 *
 * The counter-inversion is NOT done here. VirtualizedList clones this element injecting its
 * platform's exact transform into `style` — and it differs: iOS inverts with {scaleY: -1} but
 * Android with {scale: -1}, both axes. An own scaleY: -1 on top canceled out on iOS and left
 * a net {scaleX: -1} on Android: the "no messages yet" label rendered mirrored. Just apply
 * the incoming `style`.
 *
 * The icon is dimmed by color (onSurfaceVariant), not opacity — color is what de-emphasizes
 * in MD3.
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
    icon: {
        marginBottom: spacing.x2,
    },
});

export default ChatEmpty;
