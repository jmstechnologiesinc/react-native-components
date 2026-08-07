import React, { useEffect, useRef, useState } from 'react';

import Config from 'react-native-config';

import { pubnubEtaChannelName } from '@jmstechnologiesinc/commons';

import { Centrifuge } from 'centrifuge';
import { MapboxGLWrapper, localized } from '@jmstechnologiesinc/react-native-components';
import { MD3LightTheme } from '@jmstechnologiesinc/react-native-paper';
import { moderateScale } from '@jmstechnologiesinc/react-native-size-matters';

import { useSmoothDriverLocation } from './useSmoothDriverLocation';

// `getToken` is an async () => string the host app must provide. fleet-management
// now runs Centrifugo with client.insecure=false, so a tokenless connection is
// rejected. The token is minted by the Firebase callable
// `realtime-centrifugoConnectionToken`; the SDK also calls getToken again to
// refresh before expiry. This component stays firebase-agnostic -- the app wires
// the actual call (see CustomerApp usage).
//
// `getSubscriptionToken` is an async () => string minting the PER-CHANNEL
// subscription token (`realtime-centrifugoSubscriptionToken`): the server runs
// allow_subscribe_for_client=false, so the eta.<orderId> subscribe is rejected
// (103 permission denied) without one. The SDK re-calls it on token expiry and
// after reconnect; throwing centrifuge's UnauthorizedError from it (the app
// helper does this on a definitive denial) permanently unsubscribes instead of
// retrying forever.
const OrderMapboxGLMonitoring = ({ orderId, destination, getToken, getSubscriptionToken }) => {
    const subscriptionRef = useRef();
    const routeMonitoringRef = useRef(null);

    // Raw target from Centrifugo (updates ~every 4s). The animator glides the
    // rendered position between targets so the marker never teleports.
    const [driverTarget, setDriverTarget] = useState();
    const driverLocation = useSmoothDriverLocation(driverTarget);

    useEffect(() => {
        if (!orderId) return undefined;
        // TEMPORARY DIAGNOSTIC (CENTRIFUGO-LIFECYCLE) -- remove once the
        // ~5s reconnect loop is understood. The server sees this client
        // authenticate and subscribe, then a CLEAN client-side teardown
        // 5.1s later, which means this effect's cleanup is running.
        const _cfLife = Date.now();
        console.log('[CENTRIFUGO-LIFECYCLE] MOUNT effect, orderId=', orderId);

        // Scheme comes from env so environments can differ: production/dev use
        // wss:// through the GKE Ingress front-door (rt.<env-domain>, port 443,
        // managed TLS cert); bare local stacks keep the ws:// default.
        const scheme = Config.FLEET_MANAGEMENT_CENTRIFUGO_SCHEME || 'ws';
        const centrifugeClientRef = new Centrifuge(
            `${scheme}://${Config.FLEET_MANAGEMENT_CENTRIFUGO_HOST}:${Config.FLEET_MANAGEMENT_CENTRIFUGO_PORT}/connection/websocket`,
            getToken ? { getToken } : undefined
        );

        centrifugeClientRef
            .on('connecting', function (ctx) {
                console.log('centrifugo connecting:', JSON.stringify(ctx));
            })
            .on('connected', function (ctx) {
                console.log('centrifugo connected, client:', ctx.client);
            })
            .on('disconnected', function (ctx) {
                console.log('centrifugo disconnected:', JSON.stringify(ctx));
            })
            .on('error', function (ctx) {
                console.log('centrifugo error:', JSON.stringify(ctx));
            });

        const subcriptionState = centrifugeClientRef.getSubscription(pubnubEtaChannelName(orderId));

        if (subcriptionState === null) {
            // delta: 'fossil' -- fleet-management enables fossil delta
            // compression on eta.* channels, so successive near-identical GPS
            // updates arrive as diffs (~10x less bandwidth). The SDK falls back
            // to full payloads automatically if the server hasn't got it on.
            //
            // HARD DEPENDENCY: centrifuge-js decodes deltas in its JSON codec
            // via `new TextEncoder()` / `new TextDecoder()` (applyDeltaIfNeeded),
            // and React Native does NOT define those globals. Every host app
            // MUST import a polyfill before this component mounts -- CustomerApp
            // does it on the first line of index.js (`fast-text-encoding`).
            // Without it the subscription connects and then delivers NOTHING:
            // the publication handler throws, while the channel still shows a
            // subscriber and the server reports no publish errors. If the driver
            // marker ever stops moving on a healthy connection, check that
            // polyfill first.
            subscriptionRef.current = centrifugeClientRef.newSubscription(pubnubEtaChannelName(orderId), {
                delta: 'fossil',
                ...(getSubscriptionToken ? { getToken: getSubscriptionToken } : {}),
            });

            subscriptionRef.current
                .on('publication', function (ctx) {
                    setDriverTarget({
                        latitude: ctx.data.latitude,
                        longitude: ctx.data.longitude,
                        heading: ctx.data.heading,
                        formattedAddress: ctx.data.formattedEta,
                    });
                })
                .on('subscribed', function (ctx) {
                    console.log('centrifugo channel subscribed:', ctx);
                    // Seed from channel history so the marker appears with the
                    // driver's last-known position immediately, instead of
                    // waiting up to one publish interval (~4s) for the next
                    // live fix. Requires history_size/history_ttl on the eta.*
                    // namespace AND history permission for the subscriber
                    // (allow_history_for_subscriber or a token capability) in
                    // fleet-management's Centrifugo config; without them the
                    // call rejects and we keep the wait-for-live behaviour.
                    subscriptionRef.current
                        ?.history({ limit: 1, reverse: true })
                        .then((res) => {
                            const last = res.publications?.[0];
                            if (!last) return;
                            // A live publication can race ahead of this reply
                            // (and 'subscribed' re-fires on reconnect); live is
                            // always fresher, so never overwrite it with history.
                            setDriverTarget((current) =>
                                current ?? {
                                    latitude: last.data.latitude,
                                    longitude: last.data.longitude,
                                    heading: last.data.heading,
                                    formattedAddress: last.data.formattedEta,
                                }
                            );
                        })
                        .catch((err) => {
                            console.log('centrifugo history seed skipped:', err?.message || err);
                        });
                })
                .on('unsubscribed', function (ctx) {
                    console.log(`centrifugo channel unsubscribed: ${ctx.code}, ${ctx.reason}`);
                })
                .subscribe();

            centrifugeClientRef.connect();
        }

        return () => {
            console.log('[CENTRIFUGO-LIFECYCLE] CLEANUP tras',
                ((Date.now() - _cfLife) / 1000).toFixed(1), 's — orderId=', orderId);
            subscriptionRef.current?.unsubscribe?.();
            subscriptionRef.current?.removeAllListeners?.();
            subscriptionRef.current = null;
            // Tear the connection down with the screen. Without this the
            // WebSocket outlives the order view (battery + a zombie server
            // connection), and revisiting the screen stacks a second client.
            centrifugeClientRef.removeAllListeners();
            centrifugeClientRef.disconnect();
        };
    }, [orderId]);

    // Uber/DoorDash-style waiting state: the map shows real context (the
    // destination pin) from the first frame, no spinner. DriverRouteMonitoring
    // stays mounted the whole time so ONE camera instance frames the
    // destination alone and then grows its bounds to include the driver on the
    // first fix -- a declarative prop update. (Swapping in a separate
    // waiting-state camera and remounting on the first fix loses the Mapbox
    // camera hand-off and left the driver off-screen until follow mode kicked
    // in.) Until that first fix the destination tooltip reads "locating
    // driver" instead of the address; the history seed above makes that window
    // near-instant when the server allows history reads.
    return (
        <MapboxGLWrapper
            style={{ height: moderateScale(300) }}
            // The route monitor's overview->follow phases are event-driven; the
            // MapView lives here, so its lifecycle feeds the monitor through
            // its handle (events through the handle, state flows down).
            onMapIdle={() => routeMonitoringRef.current?.onMapIdle()}
            onCameraChanged={(state) => routeMonitoringRef.current?.onCameraChanged(state)}
        >
            <MapboxGLWrapper.DriverRouteMonitoring
                ref={routeMonitoringRef}
                originLocation={driverLocation}
                dropoffLocation={{
                    ...destination,
                    formattedAddress: driverLocation
                        ? destination.formattedAddress
                        : localized('trip.locatingDriver'),
                }}
            />
            {/* A pan hands the camera to the user and blocks auto-follow;
                this recentre is the deliberate way back to tracking. */}
            <MapboxGLWrapper.ResetToInitialPositionIcon
                altitude={MD3LightTheme.spacing.x2}
                onPress={() => routeMonitoringRef.current?.resetCamera()}
            />
        </MapboxGLWrapper>
    );
};

export default OrderMapboxGLMonitoring;
