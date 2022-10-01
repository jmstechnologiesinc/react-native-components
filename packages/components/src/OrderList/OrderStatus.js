import React from 'react';

import { View } from 'react-native';

import ListItemExtended from '../List/ListItemExtended';
import usePubNubETA from '../PubNubETA/usePubNubETA';
import ChipCountdown from '../PubNubETA/ChipCountdown';
import useCountdown from '../PubNubETA/useCountdown';

const OrderStatus = ({
    status,
    deliveryMethod,
    driverAvatar,
    durationValue,
    deliveryTime,
    restaurantAcceptedTime,
    role,
    orderID,
    fulfilmentStatus,
}) => {
    const orderMilliseconds = useCountdown({
        orderID,
        deliveryMethod,
        status,
        role,
        restaurantAcceptedTime,
        deliveryTime,
        durationValue,
    });

    const pubnubMilliseconds = usePubNubETA({
        orderID,
        deliveryMethod,
        status,
        role,
    });

    const vendorStatus = fulfilmentStatus.vendor;
    const driverStatus = fulfilmentStatus.driver;

    const renderStatus = [];

    const renderChipCountdown = (milliseconds) => (
        <View style={{justifyContent: "center", marginLeft: 8, marginRight: 6}}>
            <ChipCountdown milliseconds={milliseconds} />
        </View>
    );

    if(vendorStatus.header) {
        renderStatus.push(
            <ListItemExtended
                overline={vendorStatus.overline}
                header={vendorStatus.header}
                subHeader={vendorStatus.subHeader}
                chips={vendorStatus.chips}
                right={renderChipCountdown(orderMilliseconds)} />
        );
    }

    if(driverStatus.overline || driverStatus.header || driverStatus.subHeader || driverStatus.chips.length > 0) {
        renderStatus.push(
            <ListItemExtended
                overline={driverStatus.overline}
                header={driverStatus.header}
                subHeader={driverStatus.subHeader}
                chips={driverStatus.chips}
                avatar={driverAvatar}
                right={renderChipCountdown(pubnubMilliseconds)} />
        );
    }

    return renderStatus
};

export default OrderStatus;
