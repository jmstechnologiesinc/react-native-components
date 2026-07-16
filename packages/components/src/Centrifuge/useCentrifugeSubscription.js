import { useEffect, useRef } from 'react';

import { useCentrifuge } from './CentrifugeProvider';

/**
 * Escucha un canal mientras el componente esté montado.
 *
 * Los callbacks se guardan en refs a propósito. Si entraran como dependencias del
 * efecto, un `onPublication` recreado en cada render (que es lo normal: casi siempre
 * es una arrow function en el cuerpo del componente) desuscribiría y volvería a
 * suscribir el canal en cada render. El efecto solo depende del canal.
 *
 * Devuelve `false` si no hay CentrifugeProvider montado, para que el consumidor pueda
 * decidir qué hacer (el mapa, por ejemplo, cae a su cliente propio de siempre).
 */
const useCentrifugeSubscription = (
    channel,
    { getToken, onPublication, onSubscribed, onError, isEnabled = true } = {}
) => {
    const centrifuge = useCentrifuge();

    const handlersRef = useRef({});
    handlersRef.current = { getToken, onPublication, onSubscribed, onError };

    useEffect(() => {
        if (!centrifuge || !channel || !isEnabled) {
            return undefined;
        }

        return centrifuge.subscribe(channel, {
            getToken: (ctx) => handlersRef.current.getToken?.(ctx),
            onPublication: (data, ctx) => handlersRef.current.onPublication?.(data, ctx),
            onSubscribed: (ctx) => handlersRef.current.onSubscribed?.(ctx),
            onError: (error, ctx) => handlersRef.current.onError?.(error, ctx),
        });
    }, [centrifuge, channel, isEnabled]);

    return Boolean(centrifuge);
};

export default useCentrifugeSubscription;
