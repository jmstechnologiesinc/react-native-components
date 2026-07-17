import React from 'react';

import { StyleSheet, View } from 'react-native';

import { IconButton, MD3LightTheme, Text, useTheme } from '@jmstechnologiesinc/react-native-paper';

/** Quote of the message being replied to, shown above the composer. */
const ReplyPreview = ({ replyMessage, onClear, label }) => {
    const theme = useTheme();

    if (!replyMessage) {
        return null;
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.surfaceVariant }]}>
            <View style={[styles.accent, { backgroundColor: theme.colors.primary }]} />
            <View style={styles.text}>
                <Text variant="labelSmall" numberOfLines={1} style={{ color: theme.colors.primary }}>
                    {label ? `${label} ${replyMessage.user?.name}` : replyMessage.user?.name}
                </Text>
                <Text variant="bodySmall" numberOfLines={1} style={{ color: theme.colors.onSurfaceVariant }}>
                    {replyMessage.text}
                </Text>
            </View>
            <IconButton icon="close" size={18} onPress={onClear} accessibilityLabel="Cancelar respuesta" />
        </View>
    );
};

const { spacing, roundness } = MD3LightTheme;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: roundness * 2,
        marginBottom: spacing.x2,
    },
    accent: {
        width: 3,
        alignSelf: 'stretch',
        borderRadius: 3,
        marginRight: spacing.x2,
    },
    text: {
        flex: 1,
        paddingVertical: spacing.x2,
    },
});

export default ReplyPreview;
