import React from 'react';

import { View } from 'react-native';

import { List} from '@jmstechnologiesinc/react-native-paper';
import { localized } from '@jmstechnologiesinc/react-native-components';

import { ORDER_STATUS_CANCELLED } from '@jmstechnologiesinc/order';
import { MATERIAL_ICONS } from '@jmstechnologiesinc/commons';

const OrderTripTelemetry = ({
    trip
}) => {
    const telemetryList = [];
    if (trip.driver?.telemetry) {
        const telemetry = ORDER_STATUS_CANCELLED(trip.status)
            ? trip.driver.telemetry?.estimatedTravel
            : trip.driver.telemetry?.estimated;

            if (telemetry) {
            telemetryList.push({
                key: 'telemetry-total-distance',
                title: telemetry.formattedTotalDistance,
                icon: MATERIAL_ICONS.call,
                description: localized('order.distance'),
            });
            telemetryList.push({
                key: 'telemetry-total-duration',
                title: telemetry.formattedTotalDuration,
                icon: MATERIAL_ICONS.call,
                description: localized('order.duration'),
            });
        }
    }

    return telemetryList.length > 0 ? (
        <List.Section title={localized('order.telemetry')}>
            {telemetryList.map((item) => (
                <View key={item.key}>
                    <List.Item
                        title={item.title}
                        description={item.description}
                        titleNumberOfLines={0}
                        descriptionNumberOfLines={0} />
                </View>
            ))}
        </List.Section>
    ) : null
}

export default OrderTripTelemetry;
