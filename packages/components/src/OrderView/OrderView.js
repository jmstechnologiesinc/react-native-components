import React from 'react';

import { View, ScrollView } from 'react-native';

import { Divider, List, MD3LightTheme } from '@jmsstudiosinc/react-native-paper';

import { USER_ROLES } from '@jmsstudiosinc/user';
import { PUB } from '@jmsstudiosinc/vendor';
import { ORDER_STATUS_CANCELLED, ORDER_STATUS, formatedOrderStatusTime } from '@jmsstudiosinc/order';

import Accounting from '../Checkout/Accounting';
import CartListProductItem from '../CartList/CartListProductItem';
import { formatOrder } from '../OrderList/utils';
import OrderStatus from '../OrderList/OrderStatus';
import PhotoGallery from '../PhotoGallery/PhotoGallery';
import * as ActionGroup from '../ActionGroup/ActionGroup';
import { itemSeparator } from '..//utils';
import { plurulize } from '@jmsstudiosinc/commons';
import ScreenWrapperSection from '../../src/ScreenWrapper/ScreenWrapperSection';

const OrderView = ({ order, role, actionGroupButtonVariant, onButtonPress }) => {
    if (!order?.id || !USER_ROLES[role]) {
        return null;
    }

    const fulfilmentDetails = [];

    if (order.note === true) {
        fulfilmentDetails.push({
            title: order.cancelNote,
            description: 'Note',
        });
    }

    if (order.status === ORDER_STATUS.completed || ORDER_STATUS_CANCELLED(order.status) === true) {
        fulfilmentDetails.push({
            title: formatedOrderStatusTime(order),
            description: 'Date',
            icon: 'calendar-range',
        });

        if (role === USER_ROLES.vendor || role === USER_ROLES.customer) {
            if (order.deliveryOption === PUB.delivery && order.driver) {
                fulfilmentDetails.push({
                    title: order.driver.deliveryMethod,
                    description: 'Fulfillment Method',
                    icon: 'moped',
                });

                fulfilmentDetails.push({
                    title: order.driver?.formattedName,
                    description: 'Driver Name',
                    icon: 'account-tie-hat',
                });
            } else if (order.deliveryOption === PUB.pickup) {
                fulfilmentDetails.push({
                    title: order.deliveryMethod,
                    description: 'Fulfillment Method',
                    icon: 'moped',
                });
            }
        }
    }

    if (role === USER_ROLES.vendor || role === USER_ROLES.driver) {
        fulfilmentDetails.push({
            title: `${order.author.firstName} ${order.author.lastName}`,
            description: 'Full Name',
            icon: 'account',
        });

        if (order.deliveryOption === PUB.delivery) {
            fulfilmentDetails.push({
                title: order.shippingAddress.formattedAddress,
                description: 'Shipping Address',
                icon: 'map-marker',
            });
        }

        if (order.author.phone) {
            fulfilmentDetails.push({
                title: order.author.phone,
                description: 'Phone Number',
                icon: 'phone-classic',
            });
        }
    }

    if (role === USER_ROLES.customer && order.deliveryOption === PUB.pickup) {
        fulfilmentDetails.push({
            title: order.restaurant.address.formattedAddress,
            description: 'Pickup Address',
            icon: 'map-marker',
        });
    }

    const formattedOrder = formatOrder(order, role);

    return (
        <>
            <ScrollView>
                <View style={{ flex: 1 }}>
                    {role === USER_ROLES.customer || role === USER_ROLES.driver ? (
                        <PhotoGallery photos={[formattedOrder.photo]} />
                    ) : null}
                    <OrderStatus
                        role={role}
                        status={formattedOrder.status}
                        deliveryMethod={formattedOrder.deliveryMethod}
                        durationValue={formattedOrder.durationValue}
                        deliveryTime={formattedOrder.deliveryTime}
                        restaurantAcceptedTime={formattedOrder.restaurantAcceptedTime}
                        orderID={formattedOrder.orderID}
                        fulfilmentStatus={formattedOrder.fulfilmentStatus}
                        headerTitleVariant={'headlineSmall'}
                    />

                    {(role === USER_ROLES.vendor || role === USER_ROLES.customer) && (
                        <List.Section title={`${order.products.length} ${plurulize('Item', order.products.length)}`}>
                            {order.products.map((item, index) => (
                                <>
                                    <CartListProductItem data={item} isRemoveable={false} />
                                    {itemSeparator(index, order.products.length) && <Divider />}
                                </>
                            ))}
                        </List.Section>
                    )}

                    {fulfilmentDetails.length > 0 && (
                        <List.Section
                            title={order.deliveryOption === PUB.delivery ? 'Delivery Details' : 'Pickup Details'}
                        >
                            {fulfilmentDetails.map((item, index) => (
                                <>
                                    <List.Item
                                        title={item.title}
                                        description={item.description}
                                        left={() => <List.Icon icon={item.icon} />}
                                    />
                                    {itemSeparator(index, fulfilmentDetails.length) && <Divider />}
                                </>
                            ))}
                        </List.Section>
                    )}

                    <ScreenWrapperSection>
                        <Accounting fees={formattedOrder.fees} />
                    </ScreenWrapperSection>
                </View>
            </ScrollView>

            {onButtonPress && formattedOrder.fulfilmentStatus.buttons.length > 0 ? (
                <ActionGroup.Group
                    style={{
                        position: 'relative',
                        margin: MD3LightTheme.margin,
                        right: 0,
                        bottom: 0,
                    }}
                >
                    <ActionGroup.Buttons
                        variant={actionGroupButtonVariant}
                        buttons={formattedOrder.fulfilmentStatus.buttons}
                        onPress={(button) => onButtonPress(button, formattedOrder.orderID)}
                    />
                </ActionGroup.Group>
            ) : null}
        </>
    );
};

export default OrderView;
