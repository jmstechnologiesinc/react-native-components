import React, { useEffect, useRef, useState } from 'react';

import Config from 'react-native-config';

import { pubnubEtaChannelName } from '@jmstechnologiesinc/commons';

import { Centrifuge } from 'centrifuge';
import { MapboxGLWrapper } from '@jmstechnologiesinc/react-native-components';
import { moderateScale } from '@jmstechnologiesinc/react-native-size-matters';

const OrderMapboxGLMonitoring = ({ orderId, destination }) => {
    const subscriptionRef = useRef();

    const [driverLocation, setDriverLocation] = useState();

    useEffect(() => {
        if (!orderId) return null;

        const centrifugeClientRef = new Centrifuge(
            `ws://${Config.FLEET_MANAGEMENT_CENTRIFUGO_HOST}:${Config.FLEET_MANAGEMENT_CENTRIFUGO_PORT}/connection/websocket`
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
            subscriptionRef.current = centrifugeClientRef.newSubscription(pubnubEtaChannelName(orderId));

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
