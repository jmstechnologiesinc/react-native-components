import React from 'react';

import { List } from '@jmstechnologiesinc/react-native-paper';
import { localized } from '@jmstechnologiesinc/react-native-components';
// import RNLocalize from 'react-native-localize';
import * as RNLocalize from 'react-native-localize';
import { translateUnit } from '@jmstechnologiesinc/commons';

const { languageCode: locale } = RNLocalize.getLocales()[0];

const OrderTripTelemetry = ({ trajectory }) => {
    if (!trajectory) return null;

    return (
        <>
            <List.Section title={localized('trip.originLocation')}>
                <List.Item
                    title={translateUnit(trajectory.formattedPickupDistance, locale)}
                    description={localized('trip.pickupDistance.description')} // "Distance from your current location to pickup point"
                />
                <List.Item
                    title={translateUnit(trajectory.formattedPickupDuration, locale)}
                    description={localized('trip.pickupDuration.description')} // "Estimated time to reach pickup location"
                />
            </List.Section>

            <List.Section title={localized('trip.dropoffLocation')}>
                <List.Item
                    title={translateUnit(trajectory.formattedDropoffDistance, locale)}
                    description={localized('trip.dropoffDistance.description')} // "Distance from pickup to delivery destination"
                />
                <List.Item
                    title={translateUnit(trajectory.formattedDropoffDuration, locale)}
                    description={localized('trip.dropoffDuration.description')} // "Estimated delivery time from pickup to destination"
                />
            </List.Section>

            <List.Section title={localized('trip.totalTrip')}>
                <List.Item
                    title={translateUnit(trajectory.formattedTotalDistance, locale)}
                    description={localized('trip.totalDistance.description')} // "Total distance including pickup and delivery"
                />
                <List.Item
                    title={translateUnit(trajectory.formattedTotalDuration, locale)}
                    description={localized('trip.totalDuration.description')} // "Total estimated trip time including pickup and delivery"
                />
            </List.Section>
        </>
    );
};

export default OrderTripTelemetry;
