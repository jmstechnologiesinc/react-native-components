import React from 'react';

import { StyleSheet, View } from 'react-native';

import {
    MD3LightTheme,
    Avatar as PaperAvatar,
    TouchableRipple,
} from '@jmstechnologiesinc/react-native-paper';

/**
 * Library AvatarProps: { currentMessage, position, onPressAvatar, onLongPressAvatar }.
 * Painted left of the bubble, only for the other side's messages. When the message groups
 * with the previous one by the same author, the slot is reserved (`isVisible: false`) so the
 * bubbles stay aligned.
 */

const { spacing } = MD3LightTheme;
const SIZE = spacing.x7;

const Avatar = ({ currentMessage, isVisible = true, onPressAvatar, onLongPressAvatar }) => {
    if (!isVisible) {
        return <View style={styles.placeholder} />;
    }

    const { user } = currentMessage;

    return (
        <TouchableRipple
            style={styles.container}
            borderless
            onPress={() => onPressAvatar?.(user)}
            onLongPress={() => onLongPressAvatar?.(user)}
            accessibilityRole="button"
            accessibilityLabel={user?.name}
        >
            {user?.avatar ? (
                <PaperAvatar.Image size={SIZE} source={{ uri: user.avatar }} />
            ) : (
                <PaperAvatar.Text size={SIZE} label={(user?.name || '?').slice(0, 1).toUpperCase()} />
            )}
        </TouchableRipple>
    );
};

const styles = StyleSheet.create({
    container: {
        marginRight: spacing.x2,
        alignSelf: 'flex-end',
        borderRadius: SIZE / 2,
    },
    placeholder: {
        width: SIZE + spacing.x2,
    },
});

export default Avatar;
