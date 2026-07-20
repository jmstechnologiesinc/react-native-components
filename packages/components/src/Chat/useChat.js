import { useCallback, useState } from 'react';

import { generateMessageId } from './models';

/**
 * Los mensajes van en orden descendente (el más nuevo primero), porque la lista es
 * invertida: el índice 0 se pinta abajo del todo.
 */
export const append = (messages = [], newMessages = []) => {
    const list = Array.isArray(newMessages) ? newMessages : [newMessages];
    return [...list, ...messages];
};

/** Mensajes antiguos: van al final del array (arriba del todo en pantalla). */
export const prepend = (messages = [], earlierMessages = []) => {
    const list = Array.isArray(earlierMessages) ? earlierMessages : [earlierMessages];
    return [...messages, ...list];
};

/** Sustituye el mensaje más reciente. Útil para streaming y para confirmar un envío. */
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

    /** Atajo para el onSend del <Chat/>: rellena _id, createdAt y user si faltan. */
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
