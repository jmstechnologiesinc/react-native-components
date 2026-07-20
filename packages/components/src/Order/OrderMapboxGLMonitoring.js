import React, { useEffect, useRef, useState } from 'react';

import Config from 'react-native-config';

import { pubnubEtaChannelName } from '@jmstechnologiesinc/commons';

import { Centrifuge } from 'centrifuge';
import { MapboxGLWrapper } from '@jmstechnologiesinc/react-native-components';
import { moderateScale } from '@jmstechnologiesinc/react-native-size-matters';

// `getToken` is an async () => string the host app must provide. fleet-management
// now runs Centrifugo with client.insecure=false, so a tokenless connection is
// rejected. The token is minted by the Firebase callable
// `realtime-centrifugoConnectionToken`; the SDK also calls getToken again to
// refresh before expiry. This component stays firebase-agnostic -- the app wires
// the actual call (see CustomerApp usage).
const OrderMapboxGLMonitoring = ({ orderId, destination, getToken }) => {
    const subscriptionRef = useRef();

    const [driverLocation, setDriverLocation] = useState();

    useEffect(() => {
        if (!orderId) return null;

        const centrifugeClientRef = new Centrifuge(
            `ws://${Config.FLEET_MANAGEMENT_CENTRIFUGO_HOST}:${Config.FLEET_MANAGEMENT_CENTRIFUGO_PORT}/connection/websocket`,
            getToken ? { getToken } : undefined
        );

        centrifugeClientRef
            .on('connected', function (ctx) {
                console.log(`centrifugo client connected:`, ctx);
            })
            .on('disconnected', function (ctx) {
                console.log(`centrifugo client connected:`, ctx);
            })
            .on('error', function (ctx) {
                console.log('centrifugo client error:', ctx);
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
                    setDriverLocation({
                        latitude: ctx.data.latitude,
                        longitude: ctx.data.longitude,
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
