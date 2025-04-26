import React, { useEffect, useRef, useState } from 'react';

import Config from 'react-native-config';
import { List } from '@jmstechnologiesinc/react-native-paper';

import { ORDER_STATUS } from '@jmstechnologiesinc/order';
import { pubnubEtaChannelName } from '@jmstechnologiesinc/commons';

import { Centrifuge } from 'centrifuge';
import DriverStatus from './DriverStatus';
import { localized } from '../Localization/Localization';
import GeoPositionTracker from '@jmstechnologiesinc/react-native-components/lib/GeoPositionTracker';

const RealTimeDriverTacking = ({
    status, 
    orderId, 
    customerPosition,
    deliveryMethod,
    driverName,
    phoneNumber,
    vehicle,
    avatar,
    driverStatus,
}) => {
    const subscriptionRef = useRef();

    const [durationRemainingFormatted, setDurationRemainingFormatted] = useState(null);
    const [location, setLocation] = useState(null);

    useEffect(() => {
        if (status === ORDER_STATUS.shipped || status === ORDER_STATUS.inTransit) {            
          
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
            console.log(ctx)
              setDurationRemainingFormatted(ctx.data.durationRemainingFormatted);
              setLocation({latitude: ctx.data.latitude, longitude: ctx.data.longitude})
            }).on('subscribed', function (ctx) {
              console.log('centrifugo channel subscribed:', ctx);
            }).on('unsubscribed', function (ctx) {
              console.log(`centrifugo channel unsubscribed: ${ctx.code}, ${ctx.reason}`);
            }).subscribe();

            centrifugeClientRef.connect();
          }
        }

        return () => {
          subscriptionRef.current.unsubscribe?.();
          subscriptionRef.current.removeAllListeners?.();
        }
    }, [status, orderId]);

    return (
      <>
        <GeoPositionTracker
            customerPosition={customerPosition}
            currentDriverPosition={location}
            vendorPosition={location}
            rideAndSharing={false}
        />
        <List.Section title={localized("driver")}>
          <DriverStatus
              durationRemainingFormatted={durationRemainingFormatted}
              deliveryMethod={deliveryMethod}
              name={driverName}
              phoneNumber={phoneNumber}
              vehicle={vehicle}
              avatar={avatar}
              status={driverStatus}
          />
        </List.Section>
      </>
    )
};

export default RealTimeDriverTacking;
