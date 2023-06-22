import React, { useEffect, useState } from 'react';

import PubNub from 'pubnub';

import { USER_ROLES } from '@jmstechnologiesinc/user';
import { ORDER_STATUS } from '@jmstechnologiesinc/order';
import { pubnubEtaChannelName } from '@jmstechnologiesinc/commons';

const PUBNUB = {
    PUBLISH_KEY: 'pub-c-e618e49b-b38a-4d80-8ee7-0fad9fcda279',
    SUBSCRIBE_KEY: 'sub-c-c64f4f86-dad8-11eb-8c90-a639cde32e15',
};

const pubnub = new PubNub({
    publishKey: PUBNUB.PUBLISH_KEY,
    subscribeKey: PUBNUB.SUBSCRIBE_KEY,
    ssl: true,
});

const usePubNubETA = ({ orderID, deliveryMethod, status, role, onPubNub }) => {
    const [etaValue, setEtaValue] = useState(null);

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
                },
            });

            pubnub.subscribe({ channels: [pubnubEtaChannelName(orderID)] });
        } else {
            setEtaValue(undefined);
        }
    }, [deliveryMethod, status, orderID, role]);

    return etaValue;
};

export default usePubNubETA;
