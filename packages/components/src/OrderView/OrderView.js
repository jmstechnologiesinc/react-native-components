import React from 'react';

import { ScrollView, View } from 'react-native';

import { Divider, List, MD3Colors,MD3LightTheme } from '@jmstechnologiesinc/react-native-paper';

import { USER_ROLES } from '@jmstechnologiesinc/user';
import { DELIVERY_METHODS, FULFILLMENT_METHODS } from '@jmstechnologiesinc/vendor';
import {
    ORDER_STATUS_CANCELLED,
    ORDER_STATUS,
    ORDER_ACTIONS,
    orderStatusTime,
} from '@jmstechnologiesinc/order';

import Accounting from '../Accounting/Accounting';
import CartListProductItem from '../CartList/CartListProductItem';
import { formatOrder } from '../Order/utils';
import OrderStatus from '../Order/OrderStatus';
import PhotoGallery from '../PhotoGallery/PhotoGallery';
import * as ActionGroup from '../ActionGroup/ActionGroup';
import { imagekitUrl, itemSeparator } from '../utils';
import { firestoreTimestampToDate, plurulize } from '@jmstechnologiesinc/commons';
import ScreenWrapper from '../ScreenWrapper/ScreenWrapper';
import { MATERIAL_ICONS } from '@jmstechnologiesinc/commons';
import { localized } from '../Localization/Localization';
import DriverStatus from './DriverStatus';

const getDriverDetails = (order, role) => {
    const results = [];

    if (order.status !== ORDER_STATUS.completed && ORDER_STATUS_CANCELLED(order.status) === false) {
        return [];
    }

    if (order.driver?.id) {
        if (role === USER_ROLES.vendor && order.driver?.deliveryMethod) {
            results.push({
                key: 'driver-name',
                title: order.driver?.formattedName,
                description: order.driver.deliveryMethod,
                icon: MATERIAL_ICONS.account,
            });
            if(order.driver?.deliveryMethod === DELIVERY_METHODS.ownStaff) {
                results.push({
                    key: 'car-info',
                    title: order.driver.vehicle.formattedValue,
                    icon: MATERIAL_ICONS.driver,
                });
            }
        } else {
            results.push({
                key: 'driver-name',
                title: order.driver?.formattedName,
                icon: MATERIAL_ICONS.account,
            });
        }
    }

    return results;
};

const OrderView = ({
    order,
    role,
    onButtonPress,

    enableDriverStatus,
    enableHeaderStatus,
    enableVendorStatus,

    showHeaderOverline,
    showHeaderTitle,
    showHeaderDescription,
    showHeaderAvatar = false,

    showVendorOverline = false,
    showVendorTitle,
    showVendorDescription,
    showVendorAvatar = false,

    showDriverOverline,
    showDriverTitle,
    showDriverDescription,
    showDriverAvatar,
    
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
    }

    let driverDetails;

    if (role === USER_ROLES.customer) {
        fulfilmentDetails.push({
            key: 'fulfillment-address',
            title: order.fulfillmentAddress.formattedAddress,
            icon: MATERIAL_ICONS.location,
            description:
                order.fulfillmentMethod === FULFILLMENT_METHODS.delivery ? localized('order.shippingAddress') : localized('order.pickupAddress'),
        });

        fulfilmentDetails.push({
            key: 'vendor-phone',
            title: order.vendor.phone,
            icon: MATERIAL_ICONS.call,
            description: localized('order.vendor.phone'),
        });

        fulfilmentDetails.push({
            key: 'payment-method',
            title: order.payment.formattedPaymentMethod,
            icon: 'credit-card',
            description: localized('order.paymentMethod'),
        });

        if (order.fulfillmentMethod === FULFILLMENT_METHODS.delivery) {
            driverDetails = getDriverDetails(order);
        } 
    } else if (role === USER_ROLES.vendor) {
        if(order.author) {
            fulfilmentDetails.push({
                key: 'author-name',
                title: order.author.formattedName,
                icon: MATERIAL_ICONS.account,
            });
    
            if (order.author.phone) {
                fulfilmentDetails.push({
                    key: 'author-phone',
                    title: order.author.phone,
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

            driverDetails = getDriverDetails(order, role);
        } 
    }

    const telemetryList = [];
    if (
        (role === USER_ROLES.driver || 
        (role === USER_ROLES.vendor && order.driver?.deliveryMethod === DELIVERY_METHODS.ownStaff)) && 
        order.driver?.telemetry
    ) {
        const telemetry = ORDER_STATUS_CANCELLED(order.status)
            ? order.driver.telemetry?.estimatedTravel
            : order.driver.telemetry?.estimated;

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

    let formattedOrder = formatOrder(order, role);
    formattedOrder = {
        ...formattedOrder,
        fulfilmentStatus: {
            ...formattedOrder.fulfilmentStatus,
            header: {
                ...formattedOrder.fulfilmentStatus.header,
                overlines: [formattedOrder.fulfilmentStatus.header.overlines[0]],
            },
        },
    };

    const buttonsMapping = formattedOrder.fulfilmentStatus.buttons.map((button) => {
        if (ORDER_STATUS_CANCELLED(button.value)) {
            return {
                ...button,
                mode: 'text',
                compact: true,
                textColor: MD3Colors.error50,
                contentStyle: { flexGrow: 2 },
            };
        } else if (button.value === ORDER_ACTIONS.print) {
            return {
                ...button,
                icon: MATERIAL_ICONS.printer,
                mode: 'text',
                contentStyle: { flexGrow: 2 },
            };
        }

        return {
            ...button,
            compact: false,
            contentStyle: { flexGrow: 3 },
        };
    });

    const renderActionButtons =
        onButtonPress && buttonsMapping.length > 0 ? (
            <ScreenWrapper.Container>
                <ScreenWrapper.Section>
                    <ActionGroup.Group>
                        <ActionGroup.Buttons
                            buttons={buttonsMapping}
                            onPress={(button) => onButtonPress(button, formattedOrder.orderID)}
                        />
                    </ActionGroup.Group>
                </ScreenWrapper.Section>
            </ScreenWrapper.Container>
        ) : null;

    return (
        <>
            <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                <View style={{ flex: 1 }}>
                    {role === USER_ROLES.customer || role === USER_ROLES.driver ? (
                        <PhotoGallery photos={imagekitUrl([formattedOrder.photo])}  showNav={false} />
                    ) : null}

                    <OrderStatus
                        role={role}
                        formattedOrder={formattedOrder}
                        headerTitleVariant='headlineSmall'
                        enableHeaderStatus={enableHeaderStatus}
                        enableVendorStatus={enableVendorStatus}
                        enableDriverStatus={enableDriverStatus}
                        showHeaderOverline={showHeaderOverline}
                        showHeaderTitle={showHeaderTitle}
                        showHeaderDescription={showHeaderDescription}
                        showHeaderAvatar={showHeaderAvatar}
                        showVendorOverline={showVendorOverline}
                        showVendorTitle={showVendorTitle}
                        showVendorDescription={showVendorDescription}
                        showVendorAvatar={showVendorAvatar}
                        showDriverOverline={showDriverOverline}
                        showDriverTitle={showDriverTitle}
                        showDriverDescription={showDriverDescription}
                        showDriverAvatar={showDriverAvatar}
                    />

                    {(formattedOrder.fulfilmentStatus.driver.description.length > 0 || formattedOrder.fulfilmentStatus.driver.title || formattedOrder.fulfilmentStatus.driver.chips.length > 0) ? (
                        <DriverStatus
                            key="DriverStatus"
                            role={role}
                            orderID={formattedOrder.orderID}
                            deliveryMethod={formattedOrder.deliveryMethod}
                            status={formattedOrder.status}
                            header={formattedOrder.fulfilmentStatus.driver.title}
                            vehicle={formattedOrder.fulfilmentStatus.driver.vehicle}
                            description={formattedOrder.fulfilmentStatus.driver.status}
                            chips={formattedOrder.fulfilmentStatus.driver.chips}
                            avatar={formattedOrder.fulfilmentStatus.driver.avatar}
                    />) : null}

                    <Divider />

                    {fulfilmentDetails.length > 0 ? (
                        <List.Section
                            title={
                                order.fulfillmentMethod === FULFILLMENT_METHODS.delivery
                                    ? localized('order.deliveryDetails')
                                    : localized('order.pickupDetails')
                            }
                        >
                            {fulfilmentDetails.map((item, index) => (
                                <View key={item.key}>
                                    <List.Item
                                        title={item.title}
                                        description={item.description}
                                        titleNumberOfLines={0}
                                        descriptionNumberOfLines={0}
                                        left={(props) => <List.Icon {...props} icon={item.icon} />}
                                    />
                                </View>
                            ))}
                        </List.Section>
                    ) : null}

                    <Divider />

                    {driverDetails?.length > 0 ? (
                        <>
                            <List.Section title={localized('order.driverDetails')}>
                                {driverDetails.map((item, index) => (
                                    <View key={item.key}>
                                        <List.Item
                                            title={item.title}
                                            description={item.description}
                                            titleNumberOfLines={0}
                                            descriptionNumberOfLines={0}
                                            {...(item.icon
                                                ? { left: (props) => <List.Icon {...props} icon={item.icon} /> }
                                                : null)}
                                        />
                                    </View>
                                ))}
                            </List.Section>
                            <Divider />
                        </>
                    ) : null}

                    {telemetryList.length > 0 ? (
                        <>
                        <List.Section title={localized('order.telemetry')}>
                            {telemetryList.map((item, index) => (
                                <View key={item.key}>
                                    <List.Item
                                        title={item.title}
                                        description={item.description}
                                        titleNumberOfLines={0}
                                        descriptionNumberOfLines={0}
                                    />
                                </View>
                            ))}
                        </List.Section>
                           <Divider />
                           </>
                    ) : null}

                    {role === USER_ROLES.vendor || role === USER_ROLES.customer ? (
                        <List.Section
                            title={`${order.cart.products.length} ${plurulize(localized('order.item'), order.cart.products.length)}`}
                        >
                            {order.cart.products.map((item, index) => (
                                <View key={`product-item-${item.id}`}>
                                    <CartListProductItem data={item} interpunctAttributeGroup={false} />
                                    {itemSeparator(index, order.cart.products.length) ? <Divider horizontalInset /> : null}
                                </View>
                            ))}
                        </List.Section>
                    ) : null}

                    <Divider style={{ marginTop: MD3LightTheme.spacing.x1 }} />

                    <ScreenWrapper.Section>
                        <Accounting feeList={formattedOrder.fees} />
                    </ScreenWrapper.Section>
                    {role === USER_ROLES.customer && renderActionButtons}
                </View>
            </ScrollView>

            {role === USER_ROLES.vendor && renderActionButtons}
        </>
    );
};

export default OrderView;
