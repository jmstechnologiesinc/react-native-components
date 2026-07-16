import { useCallback, useRef, useState } from 'react';

import { append as appendMessages, updateLast } from './useChat';
import { generateMessageId } from './models';

/**
 * Equivalente a useStreamingMessages de la librería: respuestas que llegan token a token.
 *
 *   const { messages, append, startStream, isStreaming, stop } = useStreamingMessages({ initialMessages });
 *
 *   const stream = startStream({ user: BOT });
 *   stream.push('Hola');       // va concatenando en el último mensaje
 *   stream.done();             // cierra el mensaje
 *   stream.signal.aborted      // true si el usuario pulsó Stop
 *
 * Los tokens se acumulan en un buffer y se vuelcan una vez por frame: si el modelo escupe
 * 200 tokens/s no provocamos 200 renders.
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
        // Vuelca lo que quedara en el buffer y quita el cursor de "escribiendo".
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

            // Mensaje vacío que se irá rellenando; `streaming` pinta el cursor.
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
                    // Un solo render por frame, por muchos tokens que lleguen.
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
