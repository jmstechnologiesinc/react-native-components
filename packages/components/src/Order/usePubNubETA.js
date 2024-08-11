import React, { useEffect, useState } from 'react';

import PubNub from 'pubnub';
import Config from 'react-native-config';

import { USER_ROLES } from '@jmstechnologiesinc/user';
import { ORDER_STATUS } from '@jmstechnologiesinc/order';
import { pubnubEtaChannelName } from '@jmstechnologiesinc/commons';
import { useSelector } from 'react-redux';

const usePubNubETA = ({ orderId, deliveryMethod, status, role, onPubNub }) => {
    const [etaValue, setEtaValue] = useState(null);
    const [location, setLocation] = useState(null);
    const user = useSelector((state) => state.auth.user);

    const pubnub = new PubNub({
        publishKey: Config.PUBNUB_PUBLISH_KEY,
        subscribeKey: Config.PUBNUB_SUBSCRIBE_KEY,
        ssl: true,
        userId: user.id
    });

    useEffect(() => {
        if (
            (role === USER_ROLES.vendor && (status === ORDER_STATUS.shipped || status === ORDER_STATUS.inTransit)) ||
            (role === USER_ROLES.customer && status === ORDER_STATUS.inTransit)
        ) {
            setEtaValue(null);

            pubnub.addListener({
                message: function (msg) {
                    onPubNub?.(msg);
                    setEtaValue(msg.message.durationRemaining);
                    setLocation(msg.message.location)
                },
            });

            pubnub.subscribe({ channels: [pubnubEtaChannelName(orderId)] });
        } else {
            setEtaValue(undefined);
        }
    }, [deliveryMethod, status, orderId, role]);

    return { etaValue, location };
};

export default usePubNubETA;
