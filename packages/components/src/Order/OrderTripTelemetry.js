import React from 'react';

import { List} from '@jmstechnologiesinc/react-native-paper';
import { localized } from '@jmstechnologiesinc/react-native-components';

const OrderTripTelemetry = ({
    trajectory
}) => {
    if(!trajectory) return null;

    return (
        <>

<List.Section title={localized('trip.originLocation')}>
    <List.Item 
        title={trajectory.formattedPickupDistance} 
        description={localized('trip.pickupDistance.description')} // "Distance from your current location to pickup point"
    />
    <List.Item 
        title={trajectory.formattedPickupDuration} 
        description={localized('trip.pickupDuration.description')} // "Estimated time to reach pickup location"
    />
</List.Section>

<List.Section title={localized('trip.dropoffLocation')}>
    <List.Item 
        title={trajectory.formattedDropOffDistance} 
        description={localized('trip.dropoffDistance.description')} // "Distance from pickup to delivery destination"
    />
    <List.Item 
        title={trajectory.formattedDropoffDuration} 
        description={localized('trip.dropoffDuration.description')} // "Estimated delivery time from pickup to destination"
    />
</List.Section>

<List.Section title={localized('trip.totalTrip')}>
    <List.Item 
        title={trajectory.formattedTotalDistance} 
        description={localized('trip.totalDistance.description')} // "Total distance including pickup and delivery"
    />
    <List.Item 
        title={trajectory.formattedTotalDuration} 
        description={localized('trip.totalDuration.description')} // "Total estimated trip time including pickup and delivery"
    />
</List.Section>
        </>
    )
}

export default OrderTripTelemetry;
