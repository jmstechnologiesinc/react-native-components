import React from 'react';

import { ScrollView, View } from 'react-native';

import { Divider, List, MD3Colors } from '@jmstechnologiesinc/react-native-paper';

import { USER_ROLES } from '@jmstechnologiesinc/user';
import { DELIVERY_METHODS, FULFILLMENT_METHODS } from '@jmstechnologiesinc/vendor';
import {
    ORDER_STATUS_CANCELLED,
    ORDER_STATUS,
    formatedOrderStatusTime,
    ORDER_ACTIONS,
    orderStatusTime,
} from '@jmstechnologiesinc/order';

import Accounting from '../Accounting/Accounting';
import CartListProductItem from '../CartList/CartListProductItem';
import { formatOrder } from '../Order/utils';
import OrderStatus from '../Order/OrderStatus';
import PhotoGallery from '../PhotoGallery/PhotoGallery';
import * as ActionGroup from '../ActionGroup/ActionGroup';
import { itemSeparator } from '../utils';
import { firestoreTimestampToDate, interpunct, plurulize } from '@jmstechnologiesinc/commons';
import ScreenWrapper from '../ScreenWrapper/ScreenWrapper';
import { MATERIAL_ICONS } from '@jmstechnologiesinc/commons';

const getDriverDetails = (order, role) => {
    const results = [];

    if (order.status !== ORDER_STATUS.completed && ORDER_STATUS_CANCELLED(order.status) === false) {
        return [];
    }

    if (order.driver) {
        if (role === USER_ROLES.vendor && order.driver?.deliveryMethod) {
            results.push({
                key: 'delivery-method',
                title: order.driver.deliveryMethod,
                description: 'Driver Type',
            });
        }

        if (order.driver?.formattedName) {
            results.push({
                key: 'driver-name',
                title: order.driver?.formattedName,
                icon: MATERIAL_ICONS.account,
            });
        }

        if (order.driver?.formattedName) {
            results.push({
                key: 'driver-name',
                title: interpunct([order.driver?.carName, order.driver?.carNumber]),
                icon: MATERIAL_ICONS.driver,
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
    fastImageUrlWrapper
}) => {
    if (!order?.id || !USER_ROLES[role]) {
        return null;
    }

    const fulfilmentDetails = [];

    if (order.note === true) {
        fulfilmentDetails.push({
            key: 'cancel-note',
            title: order.cancelNote,
            description: 'Note',
        });
    }

    if (role === USER_ROLES.customer || role === USER_ROLES.vendor) {
        fulfilmentDetails.push({
            key: 'status-date',
            title: firestoreTimestampToDate(order[orderStatusTime(ORDER_STATUS.placed)])?.toLocaleString(),
            icon: MATERIAL_ICONS.calendar,
            description: 'Placed Time',
        });
    } else if (role === USER_ROLES.driver) {
        fulfilmentDetails.push({
            key: 'status-date',
            title: firestoreTimestampToDate(order[orderStatusTime(ORDER_STATUS.driverAccepted)])?.toLocaleString(),
            icon: MATERIAL_ICONS.calendar,
            description: 'Accepted Time',
        });
    }

    let driverDetails;

    if (role === USER_ROLES.customer) {
        fulfilmentDetails.push({
            key: 'fulfillment-address',
            title: order.fulfillmentAddress.formattedAddress,
            icon: MATERIAL_ICONS.location,
            description:
                order.fulfillmentMethod === FULFILLMENT_METHODS.delivery ? 'Shipping Address' : 'Pickup Address',
        });

        fulfilmentDetails.push({
            key: 'vendor-phone',
            title: order.vendor.phone,
            icon: MATERIAL_ICONS.call,
            description: 'Vendor Phone',
        });

        fulfilmentDetails.push({
            key: 'payment-method',
            title: order.payment.formattedPaymentMethod,
            icon: 'credit-card',
            description: 'Payment Method',
        });

        if (order.fulfillmentMethod === FULFILLMENT_METHODS.delivery) {
            driverDetails = getDriverDetails(order);
        } else if (order.fulfillmentMethod === FULFILLMENT_METHODS.pickup) {
        }
    } else if (role === USER_ROLES.vendor) {
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

        if (order.fulfillmentMethod === FULFILLMENT_METHODS.delivery) {
            fulfilmentDetails.push({
                key: 'fulfillment-address',
                title: order.fulfillmentAddress.formattedAddress,
                icon: MATERIAL_ICONS.location,
            });

            driverDetails = getDriverDetails(order, role);
        } else if (order.fulfillmentMethod === FULFILLMENT_METHODS.pickup) {
        }
    }

    const telemetryList = [];
    if (
        role === USER_ROLES.driver ||
        (role === USER_ROLES.vendor && order.driver?.deliveryMethod === DELIVERY_METHODS.ownStaff)
    ) {
        const telemetry = ORDER_STATUS_CANCELLED(order.status)
            ? order.driver.telemetry?.estimatedTravel
            : order.driver.telemetry?.estimated;

        if (telemetry) {
            telemetryList.push({
                key: 'telemetry-total-distance',
                title: telemetry.formattedTotalDistance,
                icon: MATERIAL_ICONS.call,
                description: 'Distance',
            });
            telemetryList.push({
                key: 'telemetry-total-duration',
                title: telemetry.formattedTotalDuration,
                icon: MATERIAL_ICONS.call,
                description: 'Duration',
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
                        <PhotoGallery photos={fastImageUrlWrapper([formattedOrder.photo])} />
                    ) : null}

                    <OrderStatus
                        role={role}
                        formattedOrder={formattedOrder}
                        headerTitleVariant={'headlineSmall'}
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

                    {fulfilmentDetails.length > 0 ? (
                        <List.Section
                            title={
                                order.fulfillmentMethod === FULFILLMENT_METHODS.delivery
                                    ? 'Delivery Details'
                                    : 'Pickup Details'
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
                                    {itemSeparator(index, fulfilmentDetails.length) && <Divider />}
                                </View>
                            ))}
                        </List.Section>
                    ) : null}

                    {driverDetails?.length > 0 ? (
                        <List.Section title={'Driver Details'}>
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
                                    {itemSeparator(index, driverDetails.length) && <Divider />}
                                </View>
                            ))}
                        </List.Section>
                    ) : null}

                    {telemetryList.length > 0 ? (
                        <List.Section title={'Telemetry'}>
                            {telemetryList.map((item, index) => (
                                <View key={item.key}>
                                    <List.Item
                                        title={item.title}
                                        description={item.description}
                                        titleNumberOfLines={0}
                                        descriptionNumberOfLines={0}
                                    />
                                    {itemSeparator(index, telemetryList.length) && <Divider />}
                                </View>
                            ))}
                        </List.Section>
                    ) : null}

                    {role === USER_ROLES.vendor || role === USER_ROLES.customer ? (
                        <List.Section
                            title={`${order.cart.products.length} ${plurulize('Item', order.cart.products.length)}`}
                        >
                            {order.cart.products.map((item, index) => (
                                <View key={`product-item-${item.id}`}>
                                    <CartListProductItem data={item} interpunctAttributeGroup={false} />
                                </View>
                            ))}
                        </List.Section>
                    ) : null}

                    <Divider />
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
