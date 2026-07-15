import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef } from 'react';

import { Centrifuge } from 'centrifuge';

/**
 * El único socket de Centrifugo de la app.
 *
 * Antes cada consumidor abría el suyo: OrderMapboxGLMonitoring creaba un cliente
 * dentro de su propio useEffect. Con el chat serían dos sockets abiertos a la vez
 * sobre la misma pantalla de pedido, cada uno con su reconexión y su backoff. Aquí
 * hay uno solo, y los canales se cuentan por referencias: dos pantallas pueden
 * escuchar el mismo canal y la suscripción real solo se cierra cuando se va la
 * última.
 *
 * El provider no sabe nada de pedidos ni de chat. Solo sabe conectar, suscribir y
 * pedir tokens cuando se los dan:
 *
 *   getToken            token de CONEXIÓN — "soy este usuario". Si no se pasa, la
 *                       conexión es anónima (el modo inseguro de desarrollo que el
 *                       mapa usa hoy).
 *   subscribe(channel, { getToken })
 *                       token de SUSCRIPCIÓN — "puedo escuchar este canal". El
 *                       namespace `chat` de Centrifugo lo exige; el del mapa no.
 *
 * Los dos tokens los mintea fastify y los sirven los callables de Firebase, que es
 * donde vive la autorización. Aquí solo se transportan.
 */
const CentrifugeContext = createContext(null);

/** El socket compartido, o null si no hay provider montado por encima. */
export const useCentrifuge = () => useContext(CentrifugeContext);

const CentrifugeProvider = ({ url, getToken, children }) => {
    const clientRef = useRef(null);
    /** canal -> { subscription, listeners:Set } */
    const channelsRef = useRef(new Map());

    // El token se lee por referencia y no por dependencia: si cambiara la identidad
    // de la función (un callback recreado en cada render de la app) y con ella el
    // cliente, se caerían todas las suscripciones vivas por debajo.
    const getTokenRef = useRef(getToken);
    getTokenRef.current = getToken;

    const getClient = useCallback(() => {
        if (!clientRef.current) {
            const client = new Centrifuge(
                url,
                getTokenRef.current ? { getToken: (ctx) => getTokenRef.current(ctx) } : undefined
            );

            // El socket también falla en silencio: si el token de conexión no vale, el
            // cliente reintenta con backoff eternamente y las suscripciones se quedan
            // colgadas sin que nadie se entere.
            client.on('error', (ctx) => console.warn('centrifuge: socket en error', ctx.error));

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

                // Se reparte a todos los oyentes del canal, no solo al primero: el
                // `subscribed` vuelve a dispararse en cada reconexión, y es de lo que
                // cuelga el replay del chat (pedir lo que se perdió mientras no había red).
                subscription
                    .on('publication', (ctx) => {
                        entry.listeners.forEach((current) => current.onPublication?.(ctx.data, ctx));
                    })
                    .on('subscribed', (ctx) => {
                        entry.listeners.forEach((current) => current.onSubscribed?.(ctx));
                    })
                    // Un canal que no llega a suscribirse —token caducado, canal que no
                    // existe, permiso denegado— se queda callado para siempre: no hay
                    // publicaciones, no hay error, no hay nada. La pantalla parece
                    // funcionar porque los mensajes que ya cargó siguen ahí. Sin esto no
                    // hay forma de distinguir "no ha escrito nadie" de "no estoy escuchando".
                    .on('error', (ctx) => {
                        console.warn('centrifuge: canal en error', channel, ctx.error);
                        entry.listeners.forEach((current) => current.onError?.(ctx.error, ctx));
                    })
                    .subscribe();
            }

            entry.listeners.add(listener);

            // `connect()` es idempotente: si ya está conectado o conectando, no hace nada.
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

                // Sin canales no hay nada que escuchar: se suelta el socket en vez de
                // dejarlo abierto consumiendo batería.
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

    const value = useMemo(() => ({ subscribe }), [subscribe]);

    return <CentrifugeContext.Provider value={value}>{children}</CentrifugeContext.Provider>;
};

export default CentrifugeProvider;
