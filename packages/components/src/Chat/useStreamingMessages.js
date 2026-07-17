import { useCallback, useRef, useState } from 'react';

import { append as appendMessages, updateLast } from './useChat';
import { generateMessageId } from './models';

/**
 * Equivalent of the library's useStreamingMessages: replies that arrive token by token.
 *
 *   const { messages, append, startStream, isStreaming, stop } = useStreamingMessages({ initialMessages });
 *
 *   const stream = startStream({ user: BOT }); // appends an empty message; `streaming` paints the cursor
 *   stream.push('Hola');       // concatenates into the last message
 *   stream.done();             // closes the message
 *   stream.signal.aborted      // true if the user pressed Stop
 *
 * Tokens accumulate in a buffer flushed once per frame: a model spitting 200 tokens/s does
 * not cause 200 renders. `stop` flushes whatever remains in the buffer and removes the
 * typing cursor.
 */
const useStreamingMessages = ({ initialMessages = [] } = {}) => {
    const [messages, setMessages] = useState(initialMessages);
    const [isStreaming, setIsStreaming] = useState(false);

    const controllerRef = useRef(null);
    const bufferRef = useRef('');
    const frameRef = useRef(null);

    const append = useCallback((newMessages) => {
        setMessages((previous) => appendMessages(previous, newMessages));
    }, []);

    const flush = useCallback(() => {
        frameRef.current = null;
        const chunk = bufferRef.current;
        if (!chunk) {
            return;
        }
        bufferRef.current = '';
        setMessages((previous) => updateLast(previous, (last) => ({ text: last.text + chunk })));
    }, []);

    const stop = useCallback(() => {
        controllerRef.current?.abort();
        controllerRef.current = null;

        if (frameRef.current) {
            cancelAnimationFrame(frameRef.current);
            frameRef.current = null;
        }
        const chunk = bufferRef.current;
        bufferRef.current = '';
        setMessages((previous) =>
            updateLast(previous, (last) => ({ text: last.text + chunk, streaming: false }))
        );
        setIsStreaming(false);
    }, []);

    const startStream = useCallback(
        ({ user, ...message } = {}) => {
            const controller = new AbortController();
            controllerRef.current = controller;
            bufferRef.current = '';
            setIsStreaming(true);

            append({
                _id: generateMessageId(),
                text: '',
                createdAt: new Date(),
                user,
                streaming: true,
                ...message,
            });

            return {
                signal: controller.signal,
                push: (token) => {
                    if (controller.signal.aborted) {
                        return;
                    }
                    bufferRef.current += token;
                    if (frameRef.current == null) {
                        frameRef.current = requestAnimationFrame(flush);
                    }
                },
                done: () => {
                    if (controller.signal.aborted) {
                        return;
                    }
                    if (frameRef.current) {
                        cancelAnimationFrame(frameRef.current);
                        frameRef.current = null;
                    }
                    const chunk = bufferRef.current;
                    bufferRef.current = '';
                    setMessages((previous) =>
                        updateLast(previous, (last) => ({ text: last.text + chunk, streaming: false }))
                    );
                    controllerRef.current = null;
                    setIsStreaming(false);
                },
            };
        },
        [append, flush]
    );

    return { messages, setMessages, append, startStream, isStreaming, stop };
};

export default useStreamingMessages;
