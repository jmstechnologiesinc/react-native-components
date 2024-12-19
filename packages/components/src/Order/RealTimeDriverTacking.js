import React, { useEffect, useRef, useState } from 'react';

import Config from 'react-native-config';
import { List } from '@jmstechnologiesinc/react-native-paper';

import { USER_ROLES } from '@jmstechnologiesinc/user';
import { ORDER_STATUS } from '@jmstechnologiesinc/order';
import { pubnubEtaChannelName } from '@jmstechnologiesinc/commons';

import { Centrifuge } from 'centrifuge';
import DriverStatus from './DriverStatus';
import { localized } from '../Localization/Localization';

const centrifugeClient = new Centrifuge(`ws://${Config.FLEET_MANAGEMENT_CENTRIFUGO_HOST}:${Config.FLEET_MANAGEMENT_CENTRIFUGO_PORT}}/connection/websocket`);

centrifugeClient.on('connected', function (ctx) {
  console.log(`centrifugo client connected:`, ctx);
}).on('disconnected', function (ctx) {
  console.log(`centrifugo client connected:`, ctx);
}).on('error', function(ctx) {
  console.log('centrifugo client error:', ctx);
})

const RealTimeDriverTacking = ({
    status, 
    orderId, 
    role,
    deliveryMethod,
    driverName,
    phoneNumber,
    vehicle,
    avatar,
    driverStatus,
}) => {
    const subscriptionRef = useRef();

    const [etaValue, setEtaValue] = useState(null);
    const [location, setLocation] = useState(null);

    useEffect(() => {
      return () => {
        subscriptionRef.current?.unsubscribe();
        subscriptionRef.current?.removeAllListeners();
        //centrifugeClient?.disconnect()
      }
    }, []);

    useEffect(() => {
        if (
            (role === USER_ROLES.vendor && (status === ORDER_STATUS.shipped || status === ORDER_STATUS.inTransit)) ||
            (role === USER_ROLES.customer && status === ORDER_STATUS.inTransit)
        ) {            
          
          const subcriptionState = centrifugeClient.getSubscription(pubnubEtaChannelName(orderId))
   
           if(subcriptionState === null) {
            subscriptionRef.current = centrifugeClient.newSubscription(pubnubEtaChannelName(orderId));
       
            subscriptionRef.current.on('publication', function (ctx) {
                setEtaValue(ctx.data.durationRemaining);
                setLocation(ctx.data.latitude, ctx.data.longitude)
              }).on('subscribed', function (ctx) {
                console.log('centrifugo channel subscribed:', ctx);
              }).on('unsubscribed', function (ctx) {
                console.log(`centrifugo channel unsubscribed: ${ctx.code}, ${ctx.reason}`);
              }).subscribe();

              centrifugeClient.connect();
           }
        }
    }, [status, orderId, role]);
  
    return (
      <List.Section title={localized("driver")}>
          <DriverStatus
              milliseconds={etaValue}
              deliveryMethod={deliveryMethod}
              name={driverName}
              phoneNumber={phoneNumber}
              vehicle={vehicle}
              avatar={avatar}
              status={driverStatus}
          />
      </List.Section>
    )
};

export default RealTimeDriverTacking;
