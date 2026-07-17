import React from 'react';

import { StyleSheet, View } from 'react-native';

import { IconButton, MD3LightTheme, TextInput, useTheme } from '@jmstechnologiesinc/react-native-paper';

import ReplyPreview from './ReplyPreview';

/**
 * The library's InputToolbar + Composer + Send + Actions in a single component with the same
 * props:
 * { text, onTextChanged, onSend, textInputProps, placeholder, isSendButtonAlwaysVisible,
 *   replyMessage, onClearReply, renderReplyPreview, renderComposer, renderSend, renderActions,
 *   onPressActionButton }
 *
 * Notes:
 * - The TextInput is Paper's (a regular host component). Growing while typing is safe as
 *   long as the message list is not a Reanimated component: see MessageList.
 * - Paper identifies input adornments by element type: the right adornment must be a direct
 *   TextInput.Icon, not a component wrapping one.
 * - While a streaming reply is arriving, Send becomes Stop.
 * - The input caps at ~five lines (maxHeight); past that the TextInput itself scrolls.
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
        maxHeight: 120,
    },
});

export default Composer;
