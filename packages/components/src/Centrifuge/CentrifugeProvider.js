import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef } from 'react';

import { Centrifuge } from 'centrifuge';

/**
 * The app's only Centrifugo socket.
 *
 * Every consumer used to open its own: OrderMapboxGLMonitoring built a client inside its own
 * useEffect. With the chat that would be two sockets open over the same order screen, each with
 * its own reconnection and backoff. There is one here, and channels are reference-counted: two
 * screens can listen to the same channel and the real subscription only closes when the last
 * one leaves.
 *
 * The provider knows nothing about orders or chat. It knows how to connect, subscribe, publish
 * and ask for tokens when it is given a way to:
 *
 *   getToken            CONNECTION token — "I am this user". Without it the connection is
 *                       anonymous (the insecure development mode the map still uses).
 *   subscribe(channel, { getToken })
 *                       SUBSCRIPTION token — "I may listen to this channel". Centrifugo's
 *                       `chat` namespace demands one; the map's does not.
 *   publish(channel, data)
 *                       Sends on an already-subscribed channel without going through the
 *                       server. Ephemeral signals only (typing…): nothing sent this way is
 *                       persisted or validated. It returns false when the channel is not
 *                       subscribed, because the subscription is what proved membership to
 *                       Centrifugo in the first place — there is no publishing blind into a
 *                       channel you are not listening to, and there should not be.
 *                       Receivers must not treat what a client publishes as equal to what the
 *                       server publishes: Centrifugo stamps client publications with the
 *                       identity from their connection token (`info` on the publication
 *                       context) and leaves server ones unstamped, and a receiver that ignores
 *                       that difference is letting a channel peer invent messages for it.
 *
 * Both tokens are minted by fastify and served by Firebase callables, which is where the
 * authorization lives. They are only transported here.
 *
 * Four details that are not free to change:
 *  · `getToken` is read through a ref rather than listed as a dependency. It is almost always an
 *    arrow function in the app's body, so a new identity on every render would rebuild the client
 *    and drop every live subscription under it.
 *  · Both `error` handlers exist because Centrifugo fails quietly. A connection token the server
 *    rejects leaves the client retrying with backoff forever; a channel that never subscribes —
 *    expired token, unknown channel, permission denied — simply says nothing at all, and the
 *    screen looks fine because the messages it already loaded are still there. Without these
 *    there is no way to tell "nobody has written" from "I am not listening".
 *  · `subscribed` is dispatched to every listener on the channel, not just the first. It fires
 *    again on each reconnect, and the chat's replay hangs off it.
 *  · The socket is released once the last channel goes, rather than left open draining battery.
 */
const CentrifugeContext = createContext(null);

/** The shared socket, or null when no provider is mounted above. */
export const useCentrifuge = () => useContext(CentrifugeContext);

const CentrifugeProvider = ({ url, getToken, children }) => {
    const clientRef = useRef(null);
    /** channel -> { subscription, listeners:Set } */
    const channelsRef = useRef(new Map());

    const getTokenRef = useRef(getToken);
    getTokenRef.current = getToken;

    const getClient = useCallback(() => {
        if (!clientRef.current) {
            const client = new Centrifuge(
                url,
                getTokenRef.current ? { getToken: (ctx) => getTokenRef.current(ctx) } : undefined
            );

            client.on('error', (ctx) => console.warn('centrifuge: socket error', ctx.error));

            clientRef.current = client;
        }

        return clientRef.current;
    }, [url]);

    const subscribe = useCallback(
        (channel, { getToken: getSubscriptionToken, onPublication, onSubscribed } = {}) => {
            if (!channel) {
                return () => {};
            }

            const client = getClient();
            const channels = channelsRef.current;

            const listener = { onPublication, onSubscribed };

            let entry = channels.get(channel);

            if (!entry) {
                const subscription =
                    client.getSubscription(channel) ??
                    client.newSubscription(
                        channel,
                        getSubscriptionToken ? { getToken: (ctx) => getSubscriptionToken(ctx) } : undefined
                    );

                entry = { subscription, listeners: new Set() };
                channels.set(channel, entry);

                subscription
                    .on('publication', (ctx) => {
                        entry.listeners.forEach((current) => current.onPublication?.(ctx.data, ctx));
                    })
                    .on('subscribed', (ctx) => {
                        entry.listeners.forEach((current) => current.onSubscribed?.(ctx));
                    })
                    .on('error', (ctx) => {
                        console.warn('centrifuge: channel error', channel, ctx.error);
                        entry.listeners.forEach((current) => current.onError?.(ctx.error, ctx));
                    })
                    .subscribe();
            }

            entry.listeners.add(listener);

            client.connect();

            return () => {
                entry.listeners.delete(listener);

                if (entry.listeners.size > 0) {
                    return;
                }

                entry.subscription.unsubscribe();
                entry.subscription.removeAllListeners();
                client.removeSubscription(entry.subscription);
                channels.delete(channel);

                if (channels.size === 0) {
                    client.disconnect();
                }
            };
        },
        [getClient]
    );

    useEffect(
        () => () => {
            channelsRef.current.forEach((entry) => {
                entry.subscription.unsubscribe();
                entry.subscription.removeAllListeners();
            });
            channelsRef.current.clear();
            clientRef.current?.disconnect();
            clientRef.current = null;
        },
        []
    );

    const publish = useCallback((channel, data) => {
        const entry = channelsRef.current.get(channel);

        if (!entry) {
            return false;
        }

        entry.subscription.publish(data).catch((error) => {
            console.warn('centrifuge: could not publish on', channel, error);
        });

        return true;
    }, []);

    const value = useMemo(() => ({ subscribe, publish }), [subscribe, publish]);

    return <CentrifugeContext.Provider value={value}>{children}</CentrifugeContext.Provider>;
};

export default CentrifugeProvider;
