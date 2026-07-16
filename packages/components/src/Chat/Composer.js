import React from 'react';

import { StyleSheet, View } from 'react-native';

import { IconButton, MD3LightTheme, TextInput, useTheme } from '@jmstechnologiesinc/react-native-paper';

import ReplyPreview from './ReplyPreview';

/**
 * Equivalente al InputToolbar + Composer + Send + Actions de la librería, en un solo
 * componente y con sus mismas props:
 * { text, onTextChanged, onSend, textInputProps, placeholder, isSendButtonAlwaysVisible,
 *   replyMessage, onClearReply, renderReplyPreview, renderComposer, renderSend, renderActions,
 *   onPressActionButton }
 *
 * El TextInput es el de Paper (componente host normal). Que crezca al escribir es seguro
 * mientras la lista de mensajes no sea un componente de Reanimated: ver MessageList.
 */

const Actions = ({ onPressActionButton }) => (
    <IconButton icon="plus" onPress={onPressActionButton} accessibilityLabel="Adjuntar" />
);

const Composer = (props) => {
    const {
        text = '',
        onTextChanged,
        onSend,
        placeholder,
        textInputProps,
        isStreaming,
        onStopStreaming,
        isSendButtonAlwaysVisible = true,
        replyMessage,
        replyLabel,
        onClearReply,
        renderReplyPreview,
        renderComposer,
        renderSend,
        renderActions,
        onPressActionButton,
    } = props;

    const theme = useTheme();
    const canSend = !!text.trim();

    return (
        <View
            style={[
                styles.container,
                { backgroundColor: theme.colors.background, borderTopColor: theme.colors.outlineVariant },
            ]}
        >
            {renderReplyPreview?.({ replyMessage, onClearReply }) ?? (
                <ReplyPreview replyMessage={replyMessage} onClear={onClearReply} label={replyLabel} />
            )}

            <View style={styles.row}>
                {onPressActionButton
                    ? renderActions?.(props) ?? <Actions onPressActionButton={onPressActionButton} />
                    : null}

                {renderComposer ? (
                    renderComposer(props)
                ) : (
                    <TextInput
                        style={styles.input}
                        value={text}
                        onChangeText={onTextChanged}
                        placeholder={placeholder}
                        multiline
                        onSubmitEditing={canSend ? onSend : undefined}
                        returnKeyType="send"
                        // Paper identifica los adornos por el tipo del elemento: tiene que ser
                        // un TextInput.Icon directo, no un componente que lo envuelva.
                        // Mientras llega una respuesta en streaming, Enviar se vuelve Stop.
                        right={
                            renderSend?.(props) ??
                            (isStreaming ? (
                                <TextInput.Icon
                                    icon="stop"
                                    onPress={onStopStreaming}
                                    accessibilityLabel="Detener"
                                />
                            ) : canSend || isSendButtonAlwaysVisible ? (
                                <TextInput.Icon
                                    icon="send"
                                    disabled={!canSend}
                                    onPress={onSend}
                                    accessibilityLabel="Enviar"
                                />
                            ) : undefined)
                        }
                        {...textInputProps}
                    />
                )}
            </View>
        </View>
    );
};

const { spacing } = MD3LightTheme;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: spacing.x2,
        paddingTop: spacing.x2,
        borderTopWidth: StyleSheet.hairlineWidth,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    input: {
        flex: 1,
        // Unas cinco líneas: a partir de ahí el propio TextInput scrollea.
        maxHeight: 120,
    },
});

export default Composer;
