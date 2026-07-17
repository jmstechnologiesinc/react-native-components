import { useCallback, useState } from 'react';

import { generateMessageId } from './models';

/**
 * Local message state helpers.
 *
 * Messages are kept in descending order (newest first) because the list is inverted: index 0
 * renders at the very bottom. `append` adds new messages, `prepend` adds earlier ones (top of
 * the screen), and `updateLast` patches the most recent one — useful for streaming and for
 * confirming a send. The hook's `send` is a shortcut for <Chat/>'s onSend: it fills in _id,
 * createdAt and user when missing.
 */

export const append = (messages = [], newMessages = []) => {
    const list = Array.isArray(newMessages) ? newMessages : [newMessages];
    return [...list, ...messages];
};

export const prepend = (messages = [], earlierMessages = []) => {
    const list = Array.isArray(earlierMessages) ? earlierMessages : [earlierMessages];
    return [...messages, ...list];
};

export const updateLast = (messages = [], update) => {
    if (!messages.length) {
        return messages;
    }
    const [last, ...rest] = messages;
    const patch = typeof update === 'function' ? update(last) : update;
    return [{ ...last, ...patch }, ...rest];
};

const useChat = ({ initialMessages = [], user } = {}) => {
    const [messages, setMessages] = useState(initialMessages);

    const appendMessages = useCallback((newMessages) => {
        setMessages((previous) => append(previous, newMessages));
    }, []);

    const prependMessages = useCallback((earlierMessages) => {
        setMessages((previous) => prepend(previous, earlierMessages));
    }, []);

    const updateLastMessage = useCallback((update) => {
        setMessages((previous) => updateLast(previous, update));
    }, []);

    const send = useCallback(
        (message) => {
            appendMessages({
                _id: generateMessageId(),
                createdAt: new Date(),
                user,
                ...message,
            });
        },
        [appendMessages, user]
    );

    return {
        messages,
        setMessages,
        send,
        append: appendMessages,
        prepend: prependMessages,
        updateLast: updateLastMessage,
    };
};

export default useChat;
