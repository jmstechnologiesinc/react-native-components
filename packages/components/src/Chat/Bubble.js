import React from 'react';

import { Image, Pressable, StyleSheet, View } from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { MD3LightTheme, Surface, Text, useTheme } from '@jmstechnologiesinc/react-native-paper';

import MessageText from './MessageText';
import QuickReplies from './QuickReplies';
import Reactions from './Reactions';
import StreamingCursor from './StreamingCursor';
import { moderateScale } from '@jmstechnologiesinc/react-native-size-matters';

/**
 * BubbleProps, same signature as the library:
 * { currentMessage, previousMessage, nextMessage, user, position, isUsernameVisible,
 *   renderMessageText, renderMessageImage, renderTime, renderCustomView,
 *   onPress, onLongPress }
 *
 * `position` is 'left' (the other side) or 'right' (me), computed by MessageList.
 *
 * Notes:
 * - Time is de-emphasized through the type scale (labelSmall), not by lowering opacity: in
 *   MD3 emphasis is carried by color role and type, and an alpha over an "on…" color eats
 *   the container's minimum contrast.
 * - Ticks is one icon with three states: pending, sent, received.
 * - The streaming cursor renders inline with the text, right after the last word.
 * - spacing and roundness do not change between light and dark themes: they are read from
 *   the token, not useTheme(), so StyleSheet.create stays static. Colors do use useTheme().
 */

const Time = ({ currentMessage, color }) => (
    <Text variant="labelSmall" style={{ color }}>
        {new Date(currentMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
    </Text>
);

const Ticks = ({ currentMessage, color }) => {
    if (currentMessage.received) {
        return <MaterialCommunityIcons name="check-all" size={moderateScale(14)} color={color} />;
    }
    if (currentMessage.sent) {
        return <MaterialCommunityIcons name="check" size={moderateScale(14)} color={color} />;
    }
    if (currentMessage.pending) {
        return <MaterialCommunityIcons name="clock-outline" size={moderateScale(14)} color={color} />;
    }
    return null;
};

const MessageImage = ({ currentMessage, imageStyle, onPressImage }) => (
    <Pressable onPress={() => onPressImage?.(currentMessage)}>
        <Image source={{ uri: currentMessage.image }} style={[styles.image, imageStyle]} resizeMode="cover" />
    </Pressable>
);

const MessageReply = ({ replyMessage }) => {
    const theme = useTheme();

    return (
        <View
            style={[
                styles.reply,
                { borderLeftColor: theme.colors.primary, backgroundColor: theme.colors.surface },
            ]}
        >
            <Text variant="labelSmall" numberOfLines={1} style={{ color: theme.colors.primary }}>
                {replyMessage.user?.name}
            </Text>
            <Text variant="bodySmall" numberOfLines={1} style={{ color: theme.colors.onSurfaceVariant }}>
                {replyMessage.text}
            </Text>
        </View>
    );
};

const Bubble = (props) => {
    const {
        currentMessage,
        nextMessage,
        user,
        position,
        isUsernameVisible,
        onPressReaction,
        wrapperStyle,
        imageStyle,
        linkStyle,
        onPressLink,
        onPressImage,
        onQuickReply,
        renderMessageText,
        renderMessageImage,
        renderTime,
        renderCustomView,
        renderQuickReplies,
        onPress,
        onLongPress,
    } = props;

    const theme = useTheme();
    const isRight = position === 'right';

    const backgroundColor = isRight ? theme.colors.primaryContainer : theme.colors.surfaceVariant;
    const color = isRight ? theme.colors.onPrimaryContainer : theme.colors.onSurfaceVariant;

    return (
        <View style={styles.container}>
            <Pressable
                onPress={() => onPress?.(currentMessage)}
                onLongPress={() => onLongPress?.(currentMessage)}
                delayLongPress={250}
            >
                <Surface elevation={1} style={[styles.bubble, { backgroundColor }, wrapperStyle?.[position]]}>
                    {!isRight && isUsernameVisible ? (
                        <Text variant="labelSmall" style={{ color: theme.colors.primary }}>
                            {currentMessage.user?.name}
                        </Text>
                    ) : null}

                    {currentMessage.replyMessage ? (
                        <MessageReply replyMessage={currentMessage.replyMessage} />
                    ) : null}

                    {currentMessage.image ? (
                        renderMessageImage ? (
                            renderMessageImage({ ...props, imageStyle })
                        ) : (
                            <MessageImage
                                currentMessage={currentMessage}
                                imageStyle={imageStyle}
                                onPressImage={onPressImage}
                            />
                        )
                    ) : null}

                    <View style={styles.text}>
                        {currentMessage.text ? (
                            renderMessageText ? (
                                renderMessageText({ ...props, color })
                            ) : (
                                <MessageText
                                    currentMessage={currentMessage}
                                    color={color}
                                    linkStyle={linkStyle}
                                    onPressLink={onPressLink}
                                />
                            )
                        ) : null}

                        {currentMessage.streaming ? <StreamingCursor color={color} /> : null}
                    </View>

                    {renderCustomView?.(props)}

                    <View style={styles.bottom}>
                        {renderTime ? (
                            renderTime({ ...props, color })
                        ) : (
                            <Time currentMessage={currentMessage} color={color} />
                        )}
                        {isRight ? <Ticks currentMessage={currentMessage} color={color} /> : null}
                    </View>
                </Surface>
            </Pressable>

            <Reactions currentMessage={currentMessage} user={user} onPressReaction={onPressReaction} />

            {currentMessage.quickReplies
                ? renderQuickReplies?.(props) ?? (
                      <QuickReplies
                          currentMessage={currentMessage}
                          nextMessage={nextMessage}
                          onQuickReply={onQuickReply}
                      />
                  )
                : null}
        </View>
    );
};

const { spacing, roundness } = MD3LightTheme;

const styles = StyleSheet.create({
    container: {
        maxWidth: '80%',
    },
    bubble: {
        paddingHorizontal: spacing.x3,
        paddingVertical: spacing.x2,
        borderRadius: roundness * moderateScale(4),
    },
    text: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    reply: {
        borderLeftWidth: moderateScale(3),
        borderRadius: roundness,
        paddingHorizontal: spacing.x2,
        paddingVertical: spacing.x1,
        marginBottom: spacing.x1,
    },
    image: {
        width: moderateScale(200),
        height: moderateScale(150),
        borderRadius: roundness * moderateScale(3),
        marginBottom: spacing.x1,
    },
    bottom: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-end',
        gap: spacing.x1,
        marginTop: spacing.x1,
    },
});

export default Bubble;
