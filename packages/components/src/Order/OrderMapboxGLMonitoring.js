import React, { useCallback, useEffect, useRef, useState } from 'react';

import Config from 'react-native-config';

import { pubnubEtaChannelName } from '@jmstechnologiesinc/commons';

import { Centrifuge } from 'centrifuge';
import { MapboxGLWrapper } from '@jmstechnologiesinc/react-native-components';
import { moderateScale } from '@jmstechnologiesinc/react-native-size-matters';

import useCentrifugeSubscription from '../Centrifuge/useCentrifugeSubscription';

const OrderMapboxGLMonitoring = ({ orderId, destination }) => {
    const subscriptionRef = useRef();

    const [driverLocation, setDriverLocation] = useState();

    const channel = orderId ? pubnubEtaChannelName(orderId) : null;

    const onPublication = useCallback((data) => {
        setDriverLocation({
            latitude: data.latitude,
            longitude: data.longitude,
            formattedAddress: data.formattedEta,
        });
    }, []);

    // Con CentrifugeProvider montado, la posición del repartidor y el chat del pedido
    // viajan por el mismo socket, que es lo que queremos: en la vista de pedido están
    // los dos a la vez. Sin provider seguimos por el camino de siempre —cliente propio,
    // conexión anónima—, así que las apps que todavía no lo montan no se enteran de
    // este cambio.
    const isSharedConnection = useCentrifugeSubscription(channel, { onPublication });

    useEffect(() => {
        if (isSharedConnection || !channel) {
            return undefined;
        }

        const centrifugeClient = new Centrifuge(
            `ws://${Config.FLEET_MANAGEMENT_CENTRIFUGO_HOST}:${Config.FLEET_MANAGEMENT_CENTRIFUGO_PORT}/connection/websocket`
        );

        centrifugeClient.on('error', function (ctx) {
            console.log('centrifugo client error:', ctx);
        });

        if (centrifugeClient.getSubscription(channel) === null) {
            subscriptionRef.current = centrifugeClient.newSubscription(channel);

            subscriptionRef.current
                .on('publication', function (ctx) {
                    onPublication(ctx.data);
                })
                .subscribe();

            centrifugeClient.connect();
        }

        return () => {
            subscriptionRef.current?.unsubscribe?.();
            subscriptionRef.current?.removeAllListeners?.();
            centrifugeClient.disconnect();
        };
    }, [isSharedConnection, channel, onPublication]);

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
