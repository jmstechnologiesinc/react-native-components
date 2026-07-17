import React from 'react';

import { StyleSheet } from 'react-native';

import { Divider, List, MD3LightTheme, Modal, Portal, useTheme } from '@jmstechnologiesinc/react-native-paper';

import { ReactionPicker } from './Reactions';

/**
 * Long-press actions sheet: emoji row on top (when reactions are enabled) and the action
 * list below. Equivalent of the library's ActionSheet + ReactionPicker (which use
 * @expo/react-native-action-sheet and react-native-emoji-chooser, dependencies this package
 * does not have); here it is Paper's Portal + Modal, already used everywhere. The container
 * uses MD3's "extra large" shape, the dialogs' one.
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
        borderRadius: roundness * 7,
        overflow: 'hidden',
    },
});

export default MessageActions;
