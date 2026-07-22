import React, { useEffect, useRef, useState } from 'react';

import Config from 'react-native-config';

import { pubnubEtaChannelName } from '@jmstechnologiesinc/commons';

import { Centrifuge } from 'centrifuge';
import { MapboxGLWrapper } from '@jmstechnologiesinc/react-native-components';
import { moderateScale } from '@jmstechnologiesinc/react-native-size-matters';

import { useSmoothDriverLocation } from './useSmoothDriverLocation';

// `getToken` is an async () => string the host app must provide. fleet-management
// now runs Centrifugo with client.insecure=false, so a tokenless connection is
// rejected. The token is minted by the Firebase callable
// `realtime-centrifugoConnectionToken`; the SDK also calls getToken again to
// refresh before expiry. This component stays firebase-agnostic -- the app wires
// the actual call (see CustomerApp usage).
const OrderMapboxGLMonitoring = ({ orderId, destination, getToken }) => {
    const subscriptionRef = useRef();

    // Raw target from Centrifugo (updates ~every 4s). The animator glides the
    // rendered position between targets so the marker never teleports.
    const [driverTarget, setDriverTarget] = useState();
    const driverLocation = useSmoothDriverLocation(driverTarget);

    useEffect(() => {
        if (!orderId) return null;

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
            subscriptionRef.current = centrifugeClientRef.newSubscription(pubnubEtaChannelName(orderId), {
                delta: 'fossil',
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
                })
                .on('unsubscribed', function (ctx) {
                    console.log(`centrifugo channel unsubscribed: ${ctx.code}, ${ctx.reason}`);
                })
                .subscribe();

            centrifugeClientRef.connect();
        }

        return () => {
            subscriptionRef.current?.unsubscribe?.();
            subscriptionRef.current?.removeAllListeners?.();
        };
    }, [orderId]);

    return (
        <MapboxGLWrapper style={{ height: moderateScale(300) }}>
            {driverLocation ? (
                <MapboxGLWrapper.DriverRouteMonitoring originLocation={driverLocation} dropoffLocation={destination} />
            ) : (
                <>
                    <MapboxGLWrapper.BoundingBoxCamera coordinates={[[destination.longitude, destination.latitude]]} />
                    <MapboxGLWrapper.PointAnnotationMaterialIcon
                        id="destination"
                        coordinate={[destination.longitude, destination.latitude]}
                    />
                    <MapboxGLWrapper.LocationTooltip
                        title={destination.formattedAddress}
                        longitude={destination.longitude}
                        latitude={destination.latitude}
                    />
                </>
            )}
        </MapboxGLWrapper>
    );
};

export default OrderMapboxGLMonitoring;
