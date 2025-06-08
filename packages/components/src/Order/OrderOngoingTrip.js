import React from 'react';

import { List as JMSList } from '@jmstechnologiesinc/react-native-components';

import { FULFILLMENT_METHODS } from '@jmstechnologiesinc/vendor';
import OrderDriverAvatar from '@jmstechnologiesinc/react-native-components/lib/Order/OrderDriverAvatar';
import { ORDER_STATUS } from '@jmstechnologiesinc/order';

const OrderOngoingTrip = ({
    status,
    fulfillmentMethod,
    driverPhoto,
    formattedDriverName,
    formattedTripStatus,
    formattedVehicleValue,
    items=[]
}) => {
    return (fulfillmentMethod === FULFILLMENT_METHODS.pickup || status === ORDER_STATUS.placed ? (
            <JMSList.Item
                title={formattedTripStatus}
                description={[]}
                titleNumberOfLines={0}
                descriptionNumberOfLines={0}
                chips={items.map(JMSList.Chip)} /> 
        ) : (
            <OrderDriverAvatar
                isLoading={status === ORDER_STATUS.driverPending}
                photo={driverPhoto}
                formattedDriverName={formattedDriverName}
                formattedTripStatus={formattedTripStatus}
                formattedVehicleValue={formattedVehicleValue}
                chips={items.map(JMSList.Chip)} />
        )
    )
}

export default OrderOngoingTrip;
