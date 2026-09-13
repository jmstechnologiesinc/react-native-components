import React from 'react';

import { List as JMSList } from '@jmstechnologiesinc/react-native-components';

import OrderDriverAvatar from '@jmstechnologiesinc/react-native-components/lib/Order/OrderDriverAvatar';

// ADR-0017 §5.4 — the other half of the single `chips` contract.
//
// This component used to map `items` through `JMSList.Chip` and hand the
// resulting ELEMENTS down to `OrderDriverAvatar`, which expected data: the two
// halves of the same feature disagreed about the shape of the same prop. Now
// both take chip data and each renders it once, at the leaf, so delegating is
// just delegating.
const OrderOngoingTrip = ({
    isLoading,
    driverPhoto,
    formattedDriverName,
    formattedTripStatus,
    formattedVehicleValue,
    chips = [],
    // DEPRECATED alias, one release (D-51): the name the app still passes.
    items,
}) => {
    const chipData = chips.length > 0 ? chips : items || [];

    return isLoading ? (
        <JMSList.Item
            title={formattedTripStatus}
            description={[]}
            titleNumberOfLines={0}
            descriptionNumberOfLines={0}
            chips={chipData.map(JMSList.Chip)}
        />
    ) : (
        <OrderDriverAvatar
            photo={driverPhoto}
            formattedDriverName={formattedDriverName}
            formattedTripStatus={formattedTripStatus}
            formattedVehicleValue={formattedVehicleValue}
            chips={chipData}
        />
    );
};

export default OrderOngoingTrip;
