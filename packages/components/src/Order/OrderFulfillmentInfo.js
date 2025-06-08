import React from 'react';

import { List} from '@jmstechnologiesinc/react-native-paper';

import { USER_ROLES } from '@jmstechnologiesinc/user';
import {  FULFILLMENT_METHODS } from '@jmstechnologiesinc/vendor';
import {
    ORDER_STATUS,
    orderStatusTime,
} from '@jmstechnologiesinc/order';

import { MATERIAL_ICONS, LOGISTICS_PLATFORMS, firestoreTimestampToDate } from '@jmstechnologiesinc/commons';
import { localized } from '@jmstechnologiesinc/react-native-components';

const OrderFulfillmentInfo = ({
    order,
    role,
    platform,
}) => {
    if (!order?.id || !USER_ROLES[role]) {
        return null;
    }

    const fulfilmentDetails = [];

    if (order.note === true) {
        fulfilmentDetails.push({
            key: 'cancel-note',
            title: order.cancelNote,
            description: localized('order.note'),
        });
    }

    if (role === USER_ROLES.customer || role === USER_ROLES.vendor) {
        fulfilmentDetails.push({
            key: 'status-date',
            title: firestoreTimestampToDate(order[orderStatusTime(ORDER_STATUS.placed)])?.toLocaleString(),
            icon: MATERIAL_ICONS.calendar,
            description: localized('order.placedTime'),
        });
    } else if (role === USER_ROLES.driver) {
        fulfilmentDetails.push({
            key: 'status-date',
            title: firestoreTimestampToDate(order[orderStatusTime(ORDER_STATUS.driverAccepted)])?.toLocaleString(),
            icon: MATERIAL_ICONS.calendar,
            description: localized("order.acceptedTime"),
        });
        if (platform === LOGISTICS_PLATFORMS.rideshare) {
            fulfilmentDetails.push({
                key: 'origin-location',
                title: order.originLocation.formattedAddress,
                icon: 'hail',
                description: localized('trip.originLocation')
            });
            fulfilmentDetails.push({
                key: 'drop-off-location',
                title: order.fulfillmentAddress.formattedAddress,
                icon: 'home-map-marker',
                description: localized('trip.dropoffLocation')
            });
        } else {
            fulfilmentDetails.push({
                key: 'drop-off-location',
                title: order.fulfillmentAddress.formattedAddress,
                icon: 'home-map-marker',
                description:
                    order.fulfillmentMethod === FULFILLMENT_METHODS.delivery ? localized('order.fulfillmentAddress') : localized('order.pickupAddress'),
            });
            fulfilmentDetails.push({
                key: 'vendor-phoneNumber',
                title: order.vendor.phoneNumber,
                icon: MATERIAL_ICONS.call,
                description: localized('order.vendor.phone'),
            });
        }

    }

    if (role === USER_ROLES.customer) {
        if (platform === LOGISTICS_PLATFORMS.rideshare) {
            fulfilmentDetails.push({
                key: 'origin-location',
                title: order.originLocation.formattedAddress,
                icon: 'hail',
                description: localized('trip.originLocation')
            });
            fulfilmentDetails.push({
                key: 'drop-off-location',
                title: order.fulfillmentAddress.formattedAddress,
                icon: 'home-map-marker',
                description: localized('trip.dropoffLocation')
            });
        } else {
            fulfilmentDetails.push({
                key: 'drop-off-location',
                title: order.fulfillmentAddress.formattedAddress,
                icon: 'home-map-marker',
                description:
                    order.fulfillmentMethod === FULFILLMENT_METHODS.delivery ? localized('order.fulfillmentAddress') : localized('order.pickupAddress'),
            });
            fulfilmentDetails.push({
                key: 'vendor-phoneNumber',
                title: order.vendor.phoneNumber,
                icon: MATERIAL_ICONS.call,
                description: localized('order.vendor.phone'),
            });
        }

        fulfilmentDetails.push({
            key: 'payment-method',
            title: order.payment.formattedPaymentMethod,
            icon: 'credit-card',
            description: localized('order.paymentMethod'),
        });
    } else if (role === USER_ROLES.vendor) {
        if (order.author) {
            fulfilmentDetails.push({
                key: 'author-name',
                title: order.author.formattedName,
                icon: MATERIAL_ICONS.account,
            });

            if (order.author.phoneNumber) {
                fulfilmentDetails.push({
                    key: 'author-phoneNumber',
                    title: order.author.phoneNumber,
                    icon: MATERIAL_ICONS.call,
                });
            }
        }

        if (order.fulfillmentMethod === FULFILLMENT_METHODS.delivery) {
            fulfilmentDetails.push({
                key: 'fulfillment-address',
                title: order.fulfillmentAddress.formattedAddress,
                icon: MATERIAL_ICONS.location,
            });
        }
    }

    return (fulfilmentDetails.length > 0 ? (
        <List.Section
            title={
                platform === LOGISTICS_PLATFORMS.rideshare ?
                    localized('trip.details') :
                    order.fulfillmentMethod === FULFILLMENT_METHODS.delivery
                        ? localized('order.deliveryDetails')
                        : localized('order.pickupDetails')}>
            {fulfilmentDetails.map((item) => (
                <List.Item
                    key={item.key}
                    title={item.title}
                    description={item.description}
                    titleNumberOfLines={0}
                    descriptionNumberOfLines={0}
                    left={(props) => <List.Icon {...props} icon={item.icon} />} />
            ))}
        </List.Section>
    ) : null);
};

export default OrderFulfillmentInfo;
