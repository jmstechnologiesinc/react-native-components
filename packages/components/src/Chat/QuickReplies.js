import React, { useCallback, useState } from 'react';

import { StyleSheet, View } from 'react-native';

import { Button, Chip, MD3LightTheme } from '@jmstechnologiesinc/react-native-paper';

/**
 * Library QuickRepliesProps: { currentMessage, onQuickReply, nextMessage, quickReplyStyle,
 * quickReplyTextStyle, quickReplyContainerStyle, sendLabel }.
 *
 * message.quickReplies = { type: 'radio' | 'checkbox', values: [{ title, value }], keepIt }
 *  - radio: pressing an option sends immediately.
 *  - checkbox: several options get selected and confirmed with the send button.
 *
 * Once answered, the options disappear unless the message asks to keep them (keepIt).
 */
const QuickReplies = ({
    currentMessage,
    nextMessage,
    onQuickReply,
    quickReplyContainerStyle,
    quickReplyStyle,
    sendLabel = 'Enviar',
}) => {
    const { quickReplies } = currentMessage;
    const [selected, setSelected] = useState([]);

    const isCheckbox = quickReplies?.type === 'checkbox';

    const onPressReply = useCallback(
        (reply) => {
            if (!isCheckbox) {
                onQuickReply?.([{ ...reply, messageId: currentMessage._id }]);
                return;
            }

            setSelected((previous) =>
                previous.some((item) => item.value === reply.value)
                    ? previous.filter((item) => item.value !== reply.value)
                    : [...previous, reply]
            );
        },
        [isCheckbox, onQuickReply, currentMessage._id]
    );

    const onPressSend = useCallback(() => {
        onQuickReply?.(selected.map((reply) => ({ ...reply, messageId: currentMessage._id })));
        setSelected([]);
    }, [onQuickReply, selected, currentMessage._id]);

    if (!quickReplies?.values?.length) {
        return null;
    }

    if (nextMessage?._id && !quickReplies.keepIt) {
        return null;
    }

    return (
        <View style={[styles.container, quickReplyContainerStyle]}>
            {quickReplies.values.map((reply) => (
                <Chip
                    key={reply.value}
                    style={[styles.chip, quickReplyStyle]}
                    selected={selected.some((item) => item.value === reply.value)}
                    showSelectedCheck={isCheckbox}
                    onPress={() => onPressReply(reply)}
                >
                    {reply.title}
                </Chip>
            ))}

            {isCheckbox && selected.length > 0 ? (
                <Button mode="contained" compact onPress={onPressSend}>
                    {sendLabel}
                </Button>
            ) : null}
        </View>
    );
};

const { spacing } = MD3LightTheme;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-end',
        gap: spacing.x2,
        marginVertical: spacing.x1,
    },
    chip: {
        alignSelf: 'flex-end',
    },
});

export default QuickReplies;
