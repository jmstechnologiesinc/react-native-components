import { useEffect, useRef } from 'react';

import { useCentrifuge } from './CentrifugeProvider';

/**
 * Listens to a channel for as long as the component is mounted.
 *
 * The callbacks are kept in refs on purpose. As effect dependencies, an `onPublication`
 * rebuilt on every render — which is the normal case, since it is almost always an arrow
 * function in the component body — would unsubscribe and resubscribe the channel on every
 * render. The effect depends on the channel and nothing else.
 *
 * Returns `false` when no CentrifugeProvider is mounted, so the consumer can decide what to
 * do (the map, for one, falls back to the standalone client it has always used).
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
