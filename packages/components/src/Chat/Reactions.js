import React from 'react';

import { StyleSheet, View } from 'react-native';

import { MD3LightTheme, Surface, Text, TouchableRipple, useTheme } from '@jmstechnologiesinc/react-native-paper';

/**
 * Reacciones emoji. En el mensaje viven como:
 *   message.reactions = [{ emoji: '👍', userIds: [1, 2] }]
 *
 * Dos piezas:
 *  - ReactionPicker: la fila de emojis que sale al mantener pulsado un mensaje.
 *  - Reactions: las burbujitas con el recuento debajo del mensaje.
 */

export const DEFAULT_EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🙏'];

/** Añade o quita la reacción del usuario. Devuelve el nuevo array de reactions. */
export const toggleReaction = (reactions = [], emoji, userId) => {
    const existing = reactions.find((reaction) => reaction.emoji === emoji);

    if (!existing) {
        return [...reactions, { emoji, userIds: [userId] }];
    }

    const hasReacted = existing.userIds.includes(userId);
    const userIds = hasReacted
        ? existing.userIds.filter((id) => id !== userId)
        : [...existing.userIds, userId];

    // Si nadie la mantiene, la reacción desaparece.
    return reactions
        .map((reaction) => (reaction.emoji === emoji ? { ...reaction, userIds } : reaction))
        .filter((reaction) => reaction.userIds.length > 0);
};

// Sin Surface propia: vive dentro de la hoja de MessageActions y hereda su color de elevación.
export const ReactionPicker = ({ emojis = DEFAULT_EMOJIS, onSelect }) => (
    <View style={styles.picker}>
        {emojis.map((emoji) => (
            <TouchableRipple
                key={emoji}
                onPress={() => onSelect(emoji)}
                style={styles.pickerItem}
                borderless
                accessibilityRole="button"
                accessibilityLabel={emoji}
            >
                <Text variant="headlineSmall">{emoji}</Text>
            </TouchableRipple>
        ))}
    </View>
);

const Reactions = ({ currentMessage, user, onPressReaction }) => {
    const theme = useTheme();
    const { reactions } = currentMessage;

    if (!reactions?.length) {
        return null;
    }

    return (
        <View style={styles.container}>
            {reactions.map((reaction) => {
                const isMine = reaction.userIds.includes(user?._id);

                return (
                    <Surface
                        key={reaction.emoji}
                        elevation={1}
                        style={[
                            styles.reaction,
                            isMine ? { backgroundColor: theme.colors.primaryContainer } : null,
                        ]}
                    >
                        <TouchableRipple
                            style={styles.reactionContent}
                            borderless
                            onPress={() => onPressReaction?.(currentMessage, reaction.emoji)}
                            accessibilityRole="button"
                        >
                            <>
                                <Text variant="labelSmall">{reaction.emoji}</Text>
                                {reaction.userIds.length > 1 ? (
                                    <Text
                                        variant="labelSmall"
                                        style={{
                                            color: isMine
                                                ? theme.colors.onPrimaryContainer
                                                : theme.colors.onSurfaceVariant,
                                        }}
                                    >
                                        {reaction.userIds.length}
                                    </Text>
                                ) : null}
                            </>
                        </TouchableRipple>
                    </Surface>
                );
            })}
        </View>
    );
};

const { spacing, roundness } = MD3LightTheme;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.x1,
        // Se solapan ligeramente con el borde inferior de la burbuja, como en cualquier chat.
        marginTop: -spacing.x2,
        marginBottom: spacing.x1,
    },
    reaction: {
        borderRadius: roundness * 2,
        // El ripple de TouchableRipple se recorta contra este radio.
        overflow: 'hidden',
    },
    reactionContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.x1,
        paddingHorizontal: spacing.x2,
        paddingVertical: spacing.x1,
    },
    picker: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: spacing.x2,
    },
    pickerItem: {
        paddingHorizontal: spacing.x2,
        paddingVertical: spacing.x1,
        borderRadius: roundness * 2,
    },
});

export default Reactions;
