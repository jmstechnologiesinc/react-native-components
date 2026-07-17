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
 * <Chat/> — adaptation of @kesha-antonov/react-native-chat with the same API, mounted on the
 * only inverted-list + keyboard combination that does not crash on RN 0.85 (see the
 * INVARIANTS in MessageList.js and ChatScreenWrapper.js).
 *
 * Props (library-compatible subset):
 *   messages, user, onSend, text, onTextChanged, isTyping, isUsernameVisible,
 *   isUserAvatarVisible, isInverted, isScrollToBottomEnabled, listProps,
 *   loadEarlierMessagesProps: { isAvailable, isLoading, isInfiniteScrollEnabled, onPress }
 *   reply: { swipe: { isEnabled, direction }, onPress }
 *   actions: [{ title, icon, onPress(message) }] — sheet shown on message long-press
 *   isAttachmentEnabled — shows the composer "+" button (camera / gallery)
 *   reactions: { isEnabled, emojis } + onReact(message, emoji) — long-press reactions
 *   isStreaming + onStopStreaming — Send becomes Stop (see useStreamingMessages)
 *   onAttach(asset) — receives the picker asset; without it, sends as image: asset.uri
 *   onQuickReply, onPressActionButton, onPressMessage, onLongPressMessage,
 *   onPressAvatar, onLongPressAvatar, onPressLink
 *   render*: renderMessage, renderBubble, renderAvatar, renderDay, renderSystemMessage,
 *            renderChatEmpty, renderChatFooter, renderLoadEarlier, renderTypingIndicator,
 *            renderMessageText, renderMessageImage,
 *            renderTime, renderCustomView, renderQuickReplies, renderComposer, renderSend,
 *            renderActions, renderReplyPreview
 *
 * Notes:
 * - Every send funnels through one point: the composer, quick replies and replies alike.
 *   Answering quick replies sends, by default, a message with the chosen titles.
 * - Long-press opens the actions sheet; with reactions enabled it always opens (there are
 *   emojis to show), with a single action and no reactions it fires that action directly.
 *   Pressing an existing reaction toggles it: state lives outside — the screen updates
 *   `message.reactions` with the toggleReaction helper.
 * - A picked photo sends as a message with `image`. If the screen passes `onAttach`, it
 *   gets the whole asset (uri, base64, type…) to upload the file and decide when and how to
 *   send — what you want in production.
 * - Visible strings go through `labels` instead of localized(), so the consuming app does
 *   not need the chat keys in its translations. Pass them already translated if needed.
 * - The keyboard is handled by ChatScreenWrapper (screen-level KeyboardAvoidingView). Do NOT
 *   wrap <Chat/> in another KeyboardAvoidingView: it re-measures the list and the crash is back.
 * - renderChatFooter renders between the list and the composer (action bars, notices…).
 * - Static helpers mirror the library: Chat.append(messages, newMessages), prepend, updateLast.
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
            if (reactions?.isEnabled || messageActions.length > 1) {
                setActionsMessage(message);
                return;
            }
            messageActions[0]?.onPress?.(message);
        },
        [props.onLongPressMessage, messageActions, reactions]
    );

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
