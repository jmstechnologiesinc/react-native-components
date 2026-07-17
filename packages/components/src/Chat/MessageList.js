import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Animated, FlatList, StyleSheet, View } from 'react-native';

import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, { useAnimatedStyle } from 'react-native-reanimated';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { FAB, MD3LightTheme, Text, useTheme } from '@jmstechnologiesinc/react-native-paper';

import Avatar from './Avatar';
import Bubble from './Bubble';
import ChatEmpty from './ChatEmpty';
import LoadEarlierMessages from './LoadEarlierMessages';
import TypingIndicator from './TypingIndicator';
import { isSameAuthor, isSameDay, isSameUser } from './models';

/**
 * Equivalent of the library's MessagesContainer with the same props:
 * { messages, user, isInverted, isUsernameVisible, isUserAvatarVisible, isTyping, listProps,
 *   loadEarlierMessagesProps, isScrollToBottomEnabled, reply, onQuickReply,
 *   renderMessage, renderBubble, renderAvatar, renderDay, renderSystemMessage,
 *   renderChatEmpty, renderTypingIndicator,
 *   onPressMessage, onLongPressMessage, onPressAvatar, onLongPressAvatar }
 *
 * ⚠️ INVARIANTS — do not touch without re-reading why:
 *
 * 1. The FlatList is React Native core's. Not Animated.createAnimatedComponent, not the
 *    gesture-handler one. The library uses a Reanimated-animated list, and that is what
 *    makes Yoga abort on RN 0.85 (YogaLayoutableShadowNode.cpp:709) as soon as the container
 *    resizes when the keyboard opens.
 * 2. Reanimated may only animate transform/opacity inside this list. Never height, padding
 *    or bottom: that re-measures the list and reproduces the same crash. That is why the
 *    scroll-to-bottom button and the TypingIndicator use core Animated over opacity/transform,
 *    and the scroll handler is a plain one (no useAnimatedScrollHandler — it would tie the
 *    list to Reanimated).
 * 3. The keyboard is avoided at SCREEN level (ChatScreenWrapper), never with a
 *    KeyboardAvoidingView wrapping this list.
 *
 * Layout notes (inverted list):
 * - "Previous in time" is the next index; offset 0 is the visual bottom. The list header
 *   renders at the bottom (typing indicator) and the footer at the top (earlier messages
 *   and their spinner).
 * - Only the last message of a same-author run shows the username and avatar.
 * - The day separator is static: the library's floating animated header wrote shared values
 *   from cell onLayout; it does not exist here.
 * - The empty state's counter-inversion is injected by VirtualizedList via `style` when it
 *   clones the element (and differs per platform) — see ChatEmpty.
 * - The swipe-to-reply action lives BEHIND the bubble in a transparent row: its opacity is
 *   tied to the gesture, or the icon would always show through the gap the bubble leaves.
 *   Reanimated there only animates opacity, which is safe.
 */

const DEFAULT_SWIPE = { isEnabled: false, direction: 'left' };
const SCROLL_TO_BOTTOM_OFFSET = 200;

const Day = ({ currentMessage }) => {
    const theme = useTheme();

    return (
        <View style={styles.day}>
            <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
                {new Date(currentMessage.createdAt).toLocaleDateString([], {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                })}
            </Text>
        </View>
    );
};

const SystemMessage = ({ currentMessage }) => {
    const theme = useTheme();

    return (
        <View style={styles.system}>
            <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
                {currentMessage.text}
            </Text>
        </View>
    );
};

const SwipeAction = ({ progress, color }) => {
    const style = useAnimatedStyle(() => ({
        opacity: progress.value,
    }));

    return (
        <Reanimated.View style={[styles.swipeAction, style]}>
            <MaterialCommunityIcons name="reply" size={22} color={color} />
        </Reanimated.View>
    );
};

const SwipeToReply = ({ swipe, onSwipe, currentMessage, children }) => {
    const theme = useTheme();
    const swipeableRef = useRef(null);

    const renderAction = useCallback(
        (progress) => <SwipeAction progress={progress} color={theme.colors.primary} />,
        [theme.colors.primary]
    );

    const isLeft = (swipe.direction ?? 'left') === 'left';

    return (
        <ReanimatedSwipeable
            ref={swipeableRef}
            friction={2}
            leftThreshold={36}
            rightThreshold={36}
            overshootLeft={false}
            overshootRight={false}
            renderLeftActions={isLeft ? renderAction : undefined}
            renderRightActions={isLeft ? undefined : renderAction}
            onSwipeableWillOpen={() => {
                onSwipe?.(currentMessage);
                swipeableRef.current?.close();
            }}
        >
            {children}
        </ReanimatedSwipeable>
    );
};

const ScrollToBottom = ({ isVisible, onPress }) => {
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(opacity, {
            toValue: isVisible ? 1 : 0,
            duration: 150,
            useNativeDriver: true,
        }).start();
    }, [isVisible, opacity]);

    return (
        <Animated.View style={[styles.scrollToBottom, { opacity }]} pointerEvents={isVisible ? 'auto' : 'none'}>
            <FAB
                icon="chevron-down"
                size="small"
                variant="surface"
                onPress={onPress}
                accessibilityLabel="Ir al último mensaje"
            />
        </Animated.View>
    );
};

const MessageList = (props) => {
    const {
        messages = [],
        user,
        isInverted = true,
        isUsernameVisible,
        isUserAvatarVisible = true,
        isTyping,
        isScrollToBottomEnabled = true,
        listProps,
        loadEarlierMessagesProps,
        reply,
        onQuickReply,
        renderMessage,
        renderBubble,
        renderAvatar,
        renderDay,
        renderSystemMessage,
        renderChatEmpty,
        renderLoadEarlier,
        renderTypingIndicator,
        onPressMessage,
        onLongPressMessage,
        onPressAvatar,
        onLongPressAvatar,
        onPressImage,
    } = props;

    const listRef = useRef(null);
    const [isScrollToBottomVisible, setIsScrollToBottomVisible] = useState(false);

    const swipe = { ...DEFAULT_SWIPE, ...reply?.swipe };

    const keyExtractor = useCallback((message) => String(message._id), []);

    const renderItem = useCallback(
        ({ item: currentMessage, index }) => {
            const olderMessage = messages[index + 1];
            const newerMessage = messages[index - 1];

            const position = isSameUser(currentMessage, user) ? 'right' : 'left';
            const isFirstOfGroup = !isSameAuthor(currentMessage, newerMessage);

            const bubbleProps = {
                currentMessage,
                previousMessage: olderMessage,
                nextMessage: newerMessage,
                user,
                position,
                isUsernameVisible: isUsernameVisible && isFirstOfGroup,
                onPress: onPressMessage,
                onLongPress: onLongPressMessage,
                onPressImage,
                onQuickReply,
                ...props.bubbleProps,
            };

            const dayFragment = !isSameDay(currentMessage, olderMessage)
                ? renderDay?.({ currentMessage }) ?? <Day currentMessage={currentMessage} />
                : null;

            if (currentMessage.system) {
                return (
                    <>
                        {dayFragment}
                        {renderSystemMessage?.({ currentMessage }) ?? (
                            <SystemMessage currentMessage={currentMessage} />
                        )}
                    </>
                );
            }

            const avatarProps = {
                currentMessage,
                position,
                isVisible: isFirstOfGroup,
                onPressAvatar,
                onLongPressAvatar,
            };

            const message = renderMessage ? (
                renderMessage(bubbleProps)
            ) : (
                <View style={[styles.row, position === 'right' ? styles.right : styles.left]}>
                    {position === 'left' && isUserAvatarVisible
                        ? renderAvatar?.(avatarProps) ?? <Avatar {...avatarProps} />
                        : null}
                    {renderBubble?.(bubbleProps) ?? <Bubble {...bubbleProps} />}
                </View>
            );

            return (
                <>
                    {dayFragment}
                    {swipe.isEnabled ? (
                        <SwipeToReply swipe={swipe} onSwipe={swipe.onSwipe} currentMessage={currentMessage}>
                            {message}
                        </SwipeToReply>
                    ) : (
                        message
                    )}
                </>
            );
        },
        [
            messages,
            user,
            isUsernameVisible,
            isUserAvatarVisible,
            onQuickReply,
            renderMessage,
            renderBubble,
            renderAvatar,
            renderDay,
            renderSystemMessage,
            onPressMessage,
            onLongPressMessage,
            onPressAvatar,
            onLongPressAvatar,
            onPressImage,
            props.bubbleProps,
            swipe,
        ]
    );

    const onEndReached = useCallback(() => {
        const { isAvailable, isInfiniteScrollEnabled, isLoading, onPress } = loadEarlierMessagesProps ?? {};
        if (isAvailable && isInfiniteScrollEnabled && !isLoading) {
            onPress?.();
        }
    }, [loadEarlierMessagesProps]);

    const onScroll = useCallback(
        (event) => {
            if (!isScrollToBottomEnabled) {
                return;
            }
            const { y } = event.nativeEvent.contentOffset;
            setIsScrollToBottomVisible(y > SCROLL_TO_BOTTOM_OFFSET);
            listProps?.onScroll?.(event);
        },
        [isScrollToBottomEnabled, listProps]
    );

    const scrollToBottom = useCallback(() => {
        listRef.current?.scrollToOffset({ offset: 0, animated: true });
    }, []);

    const ListHeaderComponent = useMemo(
        () => renderTypingIndicator?.() ?? <TypingIndicator isTyping={isTyping} />,
        [isTyping, renderTypingIndicator]
    );

    const ListFooterComponent = useMemo(
        () =>
            renderLoadEarlier?.(loadEarlierMessagesProps) ?? (
                <LoadEarlierMessages loadEarlierMessagesProps={loadEarlierMessagesProps} />
            ),
        [loadEarlierMessagesProps, renderLoadEarlier]
    );

    const ListEmptyComponent = useMemo(() => renderChatEmpty?.() ?? <ChatEmpty />, [renderChatEmpty]);

    return (
        <View style={styles.container}>
            <FlatList
                ref={listRef}
                style={styles.list}
                data={messages}
                inverted={isInverted}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                contentContainerStyle={styles.content}
                keyboardShouldPersistTaps="handled"
                onEndReached={onEndReached}
                onEndReachedThreshold={0.1}
                onScroll={onScroll}
                scrollEventThrottle={16}
                ListHeaderComponent={ListHeaderComponent}
                ListFooterComponent={ListFooterComponent}
                ListEmptyComponent={ListEmptyComponent}
                {...listProps}
            />

            {isScrollToBottomEnabled ? (
                <ScrollToBottom isVisible={isScrollToBottomVisible} onPress={scrollToBottom} />
            ) : null}
        </View>
    );
};

const { spacing } = MD3LightTheme;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    list: {
        flex: 1,
    },
    content: {
        paddingVertical: spacing.x2,
        paddingHorizontal: spacing.x3,
    },
    row: {
        marginVertical: spacing.x1,
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    left: {
        justifyContent: 'flex-start',
    },
    right: {
        justifyContent: 'flex-end',
    },
    day: {
        alignItems: 'center',
        marginVertical: spacing.x2,
    },
    system: {
        alignItems: 'center',
        marginVertical: spacing.x2,
    },
    swipeAction: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: spacing.x4,
    },
    scrollToBottom: {
        position: 'absolute',
        right: spacing.x4,
        bottom: spacing.x4,
    },
});

export default MessageList;
