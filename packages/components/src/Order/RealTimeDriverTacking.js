import React, { useEffect, useRef, useState } from 'react';

import Config from 'react-native-config';
import { List } from '@jmstechnologiesinc/react-native-paper';

import { pubnubEtaChannelName } from '@jmstechnologiesinc/commons';

import { Centrifuge } from 'centrifuge';
import DriverInfoListItem from './DriverInfoListItem';
import { localized } from '../Localization/Localization';
import {MapboxGLWrapper} from '@jmstechnologiesinc/react-native-components';
import { moderateScale } from '@jmstechnologiesinc/react-native-size-matters';

const RealTimeDriverTacking = ({
    orderId, 
    destination,
    partnerShip,
    name,
    phoneNumber,
    vehicle,
    photo,
    formattedTripStatus,
}) => {
    const subscriptionRef = useRef();

    const [driverLocation, setDriverLocation] = useState();

    useEffect(() => {   
          if(!orderId) return null;

          const centrifugeClientRef = new Centrifuge(`ws://${Config.FLEET_MANAGEMENT_CENTRIFUGO_HOST}:${Config.FLEET_MANAGEMENT_CENTRIFUGO_PORT}/connection/websocket`);

          centrifugeClientRef.on('connected', function (ctx) {
            console.log(`centrifugo client connected:`, ctx);
          }).on('disconnected', function (ctx) {
            console.log(`centrifugo client connected:`, ctx);
          }).on('error', function(ctx) {
            console.log('centrifugo client error:', ctx);
          })

          const subcriptionState = centrifugeClientRef.getSubscription(pubnubEtaChannelName(orderId))

          if(subcriptionState === null) {
          subscriptionRef.current = centrifugeClientRef.newSubscription(pubnubEtaChannelName(orderId));
      
          subscriptionRef.current.on('publication', function (ctx) {
              setDriverLocation({
                latitude: ctx.data.latitude, 
                longitude: ctx.data.longitude,
                formattedAddress: ctx.data.formattedEta
              });
            }).on('subscribed', function (ctx) {
              console.log('centrifugo channel subscribed:', ctx);
            }).on('unsubscribed', function (ctx) {
              console.log(`centrifugo channel unsubscribed: ${ctx.code}, ${ctx.reason}`);
            }).subscribe();

            centrifugeClientRef.connect();
          }

        return () => {
          subscriptionRef.current?.unsubscribe?.();
          subscriptionRef.current?.removeAllListeners?.();
        }
    }, [orderId]);

    return (
      <>
        <MapboxGLWrapper style={{height: moderateScale(300)}}>
          {driverLocation ? (
            <MapboxGLWrapper.DriverRouteMonitoring
              originLocation={driverLocation}
              dropoffLocation={destination} />
          ) : <>
              <MapboxGLWrapper.BoundingBoxCamera coordinates={[[destination.longitude, destination.latitude]]} />
              <MapboxGLWrapper.PointAnnotationMaterialIcon 
                id="destination"
                coordinate={[destination.longitude, destination.latitude]} />
              <MapboxGLWrapper.LocationTooltip 
                title={destination.formattedAddress}
                longitude={destination.longitude}
                latitude={destination.latitude} />
            </>
          }
        </MapboxGLWrapper>

        <List.Section title={localized("driver")}>
          <DriverInfoListItem
              partnerShip={partnerShip}
              name={name}
              phoneNumber={phoneNumber}
              vehicle={vehicle}
              photo={photo}
              formattedTripStatus={formattedTripStatus} />
        </List.Section> 
      </>
    )
};

export default RealTimeDriverTacking;
