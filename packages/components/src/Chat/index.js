import React, { useCallback, useMemo, useState } from 'react';

import AttachmentSheet from './AttachmentSheet';
import ChatScreenWrapper from './ChatScreenWrapper';
import Composer from './Composer';
import ImageViewer from './ImageViewer';
import MessageActions from './MessageActions';
import MessageList from './MessageList';
import { append, prepend, updateLast } from './useChat';
import { generateMessageId, toReplyMessage } from './models';

/**
 * <Chat/> — adaptación de @kesha-antonov/react-native-chat con su misma API, pero montado
 * sobre la única combinación de lista invertida + teclado que no crashea en RN 0.85
 * (ver los INVARIANTES en MessageList.js y ChatScreenWrapper.js).
 *
 * Props (subconjunto compatible con la librería):
 *   messages, user, onSend, text, onTextChanged, isTyping, isUsernameVisible,
 *   isUserAvatarVisible, isInverted, isScrollToBottomEnabled, listProps,
 *   loadEarlierMessagesProps: { isAvailable, isLoading, isInfiniteScrollEnabled, onPress }
 *   reply: { swipe: { isEnabled, direction }, onPress }
 *   actions: [{ title, icon, onPress(message) }] — hoja al mantener pulsado un mensaje
 *   isAttachmentEnabled — muestra el botón "+" del composer (cámara / galería)
 *   reactions: { isEnabled, emojis } + onReact(message, emoji) — reacciones al mantener pulsado
 *   isStreaming + onStopStreaming — el botón Enviar se convierte en Stop (ver useStreamingMessages)
 *   onAttach(asset) — recibe el asset del picker; si no se pasa, se envía como image: asset.uri
 *   onQuickReply, onPressActionButton, onPressMessage, onLongPressMessage,
 *   onPressAvatar, onLongPressAvatar, onPressLink
 *   render*: renderMessage, renderBubble, renderAvatar, renderDay, renderSystemMessage,
 *            renderChatEmpty, renderChatFooter, renderLoadEarlier, renderTypingIndicator,
 *            renderMessageText, renderMessageImage,
 *            renderTime, renderCustomView, renderQuickReplies, renderComposer, renderSend,
 *            renderActions, renderReplyPreview
 *
 * Los textos visibles van por `labels` en vez de por localized(), para no depender de que la
 * app consumidora tenga las claves del chat en sus traducciones. Pásalos ya traducidos desde
 * la pantalla si los necesitas en varios idiomas.
 *
 * El teclado lo gestiona ChatScreenWrapper (KeyboardAvoidingView a nivel de pantalla).
 * NO envuelvas <Chat/> en otro KeyboardAvoidingView: eso re-mide la lista y vuelve el crash.
 */

const DEFAULT_LABELS = {
    placeholder: 'Escribe un mensaje…',
    replyingTo: 'Respondiendo a',
    reply: 'Responder',
    send: 'Enviar',
    takePhoto: 'Hacer una foto',
    chooseFromLibrary: 'Elegir de la galería',
};

const Chat = ({
    messages = [],
    user,
    onSend,
    text: textProp,
    onTextChanged,
    labels: labelsProp,
    actions,
    onQuickReply,
    onAttach,
    reactions,
    onReact,
    isStreaming,
    onStopStreaming,
    isReplyEnabled = true,
    isAttachmentEnabled = false,
    screenWrapperWithBottomInset = true,
    ...props
}) => {
    const [internalText, setInternalText] = useState('');
    const [replyMessage, setReplyMessage] = useState(null);
    const [actionsMessage, setActionsMessage] = useState(null);
    const [isAttachmentSheetVisible, setIsAttachmentSheetVisible] = useState(false);
    const [viewerImage, setViewerImage] = useState(null);

    const labels = { ...DEFAULT_LABELS, ...labelsProp };

    const isTextControlled = textProp != null;
    const text = isTextControlled ? textProp : internalText;

    const handleTextChanged = useCallback(
        (value) => {
            if (!isTextControlled) {
                setInternalText(value);
            }
            onTextChanged?.(value);
        },
        [isTextControlled, onTextChanged]
    );

    /** Único punto de envío: el composer, las quick replies y el reply pasan por aquí. */
    const send = useCallback(
        (message) => {
            onSend?.([
                {
                    _id: generateMessageId(),
                    createdAt: new Date(),
                    user,
                    ...message,
                },
            ]);
        },
        [onSend, user]
    );

    const handleSend = useCallback(() => {
        const trimmed = text.trim();
        if (!trimmed) {
            return;
        }

        send({
            text: trimmed,
            replyMessage: replyMessage ? toReplyMessage(replyMessage) : undefined,
        });

        handleTextChanged('');
        setReplyMessage(null);
    }, [text, replyMessage, send, handleTextChanged]);

    const handleReply = useCallback(
        (message) => {
            setReplyMessage(message);
            props.reply?.onPress?.(message);
        },
        [props.reply]
    );

    /** Por defecto, contestar a unas quick replies envía un mensaje con los títulos elegidos. */
    const handleQuickReply = useCallback(
        (replies) => {
            if (!replies?.length) {
                return;
            }
            if (onQuickReply) {
                onQuickReply(replies);
                return;
            }
            send({ text: replies.map((item) => item.title).join(', ') });
        },
        [onQuickReply, send]
    );

    /**
     * Al elegir una foto se envía como mensaje con `image`. Si la pantalla pasa `onAttach`,
     * se le cede el asset entero (uri, base64, tipo…) para que suba el fichero y decida
     * cuándo y cómo mandarlo; es lo que querrás en producción.
     */
    const handlePickAttachment = useCallback(
        (asset) => {
            if (onAttach) {
                onAttach(asset);
                return;
            }
            send({ text: '', image: asset.uri });
        },
        [onAttach, send]
    );

    const reply = useMemo(
        () => ({
            ...props.reply,
            swipe: {
                isEnabled: isReplyEnabled,
                direction: 'left',
                ...props.reply?.swipe,
                onSwipe: handleReply,
            },
        }),
        [props.reply, isReplyEnabled, handleReply]
    );

    // Mantener pulsado abre la hoja de acciones. Si no hay acciones extra, responde directo.
    const messageActions = useMemo(() => {
        const replyAction = isReplyEnabled
            ? [{ title: labels.reply, icon: 'reply', onPress: handleReply }]
            : [];
        return [...replyAction, ...(actions ?? [])];
    }, [actions, isReplyEnabled, labels.reply, handleReply]);

    const handleLongPressMessage = useCallback(
        (message) => {
            if (props.onLongPressMessage) {
                props.onLongPressMessage(message);
                return;
            }
            // Con reacciones activas la hoja siempre se abre (hay emojis que mostrar).
            if (reactions?.isEnabled || messageActions.length > 1) {
                setActionsMessage(message);
                return;
            }
            messageActions[0]?.onPress?.(message);
        },
        [props.onLongPressMessage, messageActions, reactions]
    );

    /**
     * Pulsar una reacción existente la quita (o la añade, si no eras de los que reaccionaron).
     * El estado vive fuera: le pasamos a la pantalla el mensaje y el emoji, y ella actualiza
     * `message.reactions` con el helper toggleReaction.
     */
    const handleReact = useCallback(
        (message, emoji) => {
            onReact?.(message, emoji);
        },
        [onReact]
    );

    return (
        <ChatScreenWrapper withBottomInset={screenWrapperWithBottomInset}>
            <MessageList
                {...props}
                messages={messages}
                user={user}
                reply={reply}
                onQuickReply={handleQuickReply}
                onLongPressMessage={handleLongPressMessage}
                onPressImage={(message) => setViewerImage(message.image)}
                onPressReaction={handleReact}
            />

            {/* Hueco entre la lista y el composer: barras de acciones, avisos, etc. */}
            {props.renderChatFooter?.()}

            <Composer
                {...props}
                text={text}
                onTextChanged={handleTextChanged}
                onSend={handleSend}
                placeholder={props.placeholder ?? labels.placeholder}
                replyMessage={replyMessage}
                replyLabel={labels.replyingTo}
                onClearReply={() => setReplyMessage(null)}
                isStreaming={isStreaming}
                onStopStreaming={onStopStreaming}
                onPressActionButton={
                    props.onPressActionButton ??
                    (isAttachmentEnabled ? () => setIsAttachmentSheetVisible(true) : undefined)
                }
            />

            <MessageActions
                message={actionsMessage}
                actions={messageActions}
                reactions={reactions}
                onReact={handleReact}
                onDismiss={() => setActionsMessage(null)}
            />

            <AttachmentSheet
                isVisible={isAttachmentSheetVisible}
                onDismiss={() => setIsAttachmentSheetVisible(false)}
                onPick={handlePickAttachment}
                labels={labels}
            />

            <ImageViewer uri={viewerImage} onDismiss={() => setViewerImage(null)} />
        </ChatScreenWrapper>
    );
};

// Mismos helpers estáticos que la librería: Chat.append(messages, newMessages).
Chat.append = append;
Chat.prepend = prepend;
Chat.updateLast = updateLast;

export default Chat;
export { default as useChat } from './useChat';
export { default as AttachmentSheet } from './AttachmentSheet';
export { default as Avatar } from './Avatar';
export { default as ImageViewer } from './ImageViewer';
export { default as Reactions, ReactionPicker, toggleReaction, DEFAULT_EMOJIS } from './Reactions';
export { default as StreamingCursor } from './StreamingCursor';
export { default as useStreamingMessages } from './useStreamingMessages';
export { default as Bubble } from './Bubble';
export { default as ChatEmpty } from './ChatEmpty';
export { default as LoadEarlierMessages } from './LoadEarlierMessages';
export { default as Composer } from './Composer';
export { default as MessageList } from './MessageList';
export { default as MessageText } from './MessageText';
export { default as QuickReplies } from './QuickReplies';
export { default as ReplyPreview } from './ReplyPreview';
export { default as TypingIndicator } from './TypingIndicator';
export * from './models';
