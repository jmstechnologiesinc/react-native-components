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
 * Equivalente al MessagesContainer de la librería, con sus mismas props:
 * { messages, user, isInverted, isUsernameVisible, isUserAvatarVisible, isTyping, listProps,
 *   loadEarlierMessagesProps, isScrollToBottomEnabled, reply, onQuickReply,
 *   renderMessage, renderBubble, renderAvatar, renderDay, renderSystemMessage,
 *   renderChatEmpty, renderTypingIndicator,
 *   onPressMessage, onLongPressMessage, onPressAvatar, onLongPressAvatar }
 *
 * ⚠️ INVARIANTES. No tocar sin releer por qué:
 *
 * 1. La FlatList es la del core de React Native. Ni Animated.createAnimatedComponent, ni la
 *    de react-native-gesture-handler. La librería usa una lista animada por Reanimated y eso
 *    es lo que hace abortar a Yoga en RN 0.85 (YogaLayoutableShadowNode.cpp:709) en cuanto el
 *    contenedor cambia de tamaño al abrir el teclado.
 * 2. Reanimated solo puede animar transform/opacity dentro de esta lista. Nunca height,
 *    padding ni bottom: eso re-mide la lista y reproduce el mismo crash. Por eso el botón de
 *    scroll-to-bottom y el TypingIndicator usan el Animated del core sobre opacity/transform.
 * 3. El teclado se esquiva a nivel de PANTALLA (FormInputsScreenWrapper), nunca con un
 *    KeyboardAvoidingView envolviendo esta lista.
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

/** Swipe para responder. Reanimated aquí solo anima opacity/transform: es seguro. */
const SwipeToReply = ({ swipe, onSwipe, currentMessage, children }) => {
    const theme = useTheme();
    const swipeableRef = useRef(null);

    const renderAction = useCallback(
        (progress) => (
            // La acción vive DETRÁS de la burbuja, y la fila es transparente: sin esta opacidad
            // ligada al gesto, el icono se vería siempre a través del hueco que deja la burbuja.
            <SwipeAction progress={progress} color={theme.colors.primary} />
        ),
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

/** Solo anima opacity, y con el Animated del core. Ver invariante 2. */
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
            // En una lista invertida, el "anterior en el tiempo" es el índice siguiente.
            const olderMessage = messages[index + 1];
            const newerMessage = messages[index - 1];

            const position = isSameUser(currentMessage, user) ? 'right' : 'left';
            // Solo el último de una tanda del mismo autor muestra nombre y avatar.
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

            // Separador de día: estático. La cabecera flotante animada de la librería es la
            // que escribía shared values desde el onLayout de las celdas; aquí no existe.
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

    // Handler de scroll normal (nada de useAnimatedScrollHandler: eso ata la lista a Reanimated).
    const onScroll = useCallback(
        (event) => {
            if (!isScrollToBottomEnabled) {
                return;
            }
            const { y } = event.nativeEvent.contentOffset;
            // Lista invertida: el "abajo del todo" es offset 0.
            setIsScrollToBottomVisible(y > SCROLL_TO_BOTTOM_OFFSET);
            listProps?.onScroll?.(event);
        },
        [isScrollToBottomEnabled, listProps]
    );

    const scrollToBottom = useCallback(() => {
        listRef.current?.scrollToOffset({ offset: 0, animated: true });
    }, []);

    // En la lista invertida el header se pinta abajo (donde va el "escribiendo…") y el footer
    // arriba (donde van los mensajes antiguos y su spinner).
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

    // Sin isInverted: la contra-inversión del vacío la inyecta VirtualizedList por `style`
    // al clonarlo (y es distinta por plataforma). Ver el comentario de ChatEmpty.
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
