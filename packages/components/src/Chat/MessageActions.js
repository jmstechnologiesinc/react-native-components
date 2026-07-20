import React from 'react';

import { StyleSheet } from 'react-native';

import { Divider, List, MD3LightTheme, Modal, Portal, useTheme } from '@jmstechnologiesinc/react-native-paper';

import { ReactionPicker } from './Reactions';

/**
 * Hoja de acciones al mantener pulsado un mensaje: fila de emojis arriba (si las reacciones
 * están activadas) y lista de acciones debajo. Equivale al ActionSheet + ReactionPicker de la
 * librería (que usa @expo/react-native-action-sheet y react-native-emoji-chooser, dependencias
 * que esta app no tiene); aquí va con Portal + Modal de Paper, que ya usamos en todas partes.
 *
 * actions: [{ title, icon, onPress(message) }]
 */
const MessageActions = ({ message, actions = [], reactions, onReact, onDismiss }) => {
    const theme = useTheme();

    return (
        <Portal>
            <Modal
                visible={!!message}
                onDismiss={onDismiss}
                contentContainerStyle={[
                    styles.container,
                    { backgroundColor: theme.colors.elevation.level3 },
                ]}
            >
                {reactions?.isEnabled ? (
                    <>
                        <ReactionPicker
                            emojis={reactions.emojis}
                            onSelect={(emoji) => {
                                onDismiss();
                                onReact?.(message, emoji);
                            }}
                        />
                        <Divider />
                    </>
                ) : null}

                {actions.map((action, index) => (
                    <React.Fragment key={action.title}>
                        {index > 0 ? <Divider /> : null}
                        <List.Item
                            title={action.title}
                            left={action.icon ? (props) => <List.Icon {...props} icon={action.icon} /> : undefined}
                            onPress={() => {
                                onDismiss();
                                action.onPress?.(message);
                            }}
                        />
                    </React.Fragment>
                ))}
            </Modal>
        </Portal>
    );
};

const { spacing, roundness } = MD3LightTheme;

const styles = StyleSheet.create({
    container: {
        marginHorizontal: spacing.x6,
        // Forma "extra large" de MD3, la de los diálogos.
        borderRadius: roundness * 7,
        overflow: 'hidden',
    },
});

export default MessageActions;
