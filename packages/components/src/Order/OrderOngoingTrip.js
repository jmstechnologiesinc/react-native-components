import React from 'react';

import { List as JMSList } from '@jmstechnologiesinc/react-native-components';

import OrderDriverAvatar from '@jmstechnologiesinc/react-native-components/lib/Order/OrderDriverAvatar';

const OrderOngoingTrip = ({
    isLoading,
    driverPhoto,
    formattedDriverName,
    formattedTripStatus,
    formattedVehicleValue,
    items=[]
}) => {
    return (isLoading ? (
            <JMSList.Item
                title={formattedTripStatus}
                description={[]}
                titleNumberOfLines={0}
                descriptionNumberOfLines={0}
                chips={items.map(JMSList.Chip)} /> 
        ) : (
            <OrderDriverAvatar
                photo={driverPhoto}
                formattedDriverName={formattedDriverName}
                formattedTripStatus={formattedTripStatus}
                formattedVehicleValue={formattedVehicleValue}
                chips={items.map(JMSList.Chip)} />
        )
    )
}

export default OrderOngoingTrip;
