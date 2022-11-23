import React from 'react';

import { ScrollView ,View} from 'react-native';

import { Divider, List, MD3LightTheme } from '@jmsstudiosinc/react-native-paper';

import { USER_ROLES } from '@jmsstudiosinc/user';
import {  PUB } from '@jmsstudiosinc/vendor';
import { ORDER_STATUS_CANCELLED, ORDER_STATUS, formatedOrderStatusTime, ORDER_ACTIONS } from '@jmsstudiosinc/order';

import Accounting from '../Checkout/Accounting';
import CartListProductItem from '../CartList/CartListProductItem';
import { formatOrder } from '../OrderList/utils';
import OrderStatus from '../OrderList/OrderStatus';
import PhotoGallery from '../PhotoGallery/PhotoGallery';
import * as ActionGroup from '../ActionGroup/ActionGroup';
import { itemSeparator } from '../utils';
import { plurulize } from '@jmsstudiosinc/commons';
import ScreenWrapperSection from '../ScreenWrapper/ScreenWrapperSection';

const OrderView = ({ 
    order, 
    role, 
    onButtonPress 
}) => {
    if(!order?.id || !USER_ROLES[role]) {
        return null;
    }

    const fulfilmentDetails = [];
    const driverDetails = [];

    if (order.note === true) {
        fulfilmentDetails.push({
            key: "cancel-note",
            title: order.cancelNote,
            description: 'Note',
        });
    }

    if ((order.status === ORDER_STATUS.completed || ORDER_STATUS_CANCELLED(order.status) === true)) {
        fulfilmentDetails.push({
            key: "status-date",
            title: formatedOrderStatusTime(order),
            description: 'Date',
            icon: 'calendar-range',
        });
    }

    if(role === USER_ROLES.vendor || role === USER_ROLES.customer) {
        if (order.fulfillmentMethod === PUB.delivery) {
            if(order.driver) {
                driverDetails.push({
                    key: "delivery-method",
                    title: order.driver.deliveryMethod,
                    description: 'Delivery Method',
                    icon: "car"
                });    
                driverDetails.push({
                    key: "driver-name",
                    title: order.driver?.formattedName,
                    description: 'Name',
                    icon: "card-account-details"
                });
                if(order.driver.phone) {
                    driverDetails.push({
                        key: "driver-phone",
                        title: order.driver.phone,
                        description: 'Phone',
                        icon: "phone"
                    });
                }
            } else {
                driverDetails.push({
                    key: "driver-delivery-method",
                    title: order.deliveryMethod,
                    description: 'Delivery Method',
                    icon: "car"
                }); 
            }
        } else if (order.fulfillmentMethod === PUB.pickup) {
            fulfilmentDetails.push({
                key: "delivery-method",
                title: order.deliveryMethod,
                description: 'Fulfillment Method',
                icon: "account"
            });
        }
    }

    if (role === USER_ROLES.vendor || role === USER_ROLES.driver) {
        fulfilmentDetails.push({
            key: "author-name",
            title: order.author.formattedName,
            description: 'Name',
            icon: "card-account-details"
        });

        if(order.author.phone) {
            fulfilmentDetails.push({
                key: "author-phone",
                title: order.author.phone,
                description: 'Phone',
                icon: "phone"
            });
        }
    }

    if(order.fulfillmentMethod === PUB.delivery) {
        fulfilmentDetails.push({
            key: "shipping-address",
            title: order.shippingAddress.formattedAddress,
            description: 'Shipping Address',
            icon: "map-marker"
        });
    } else if(role === USER_ROLES.customer && order.fulfillmentMethod === PUB.pickup) {
        fulfilmentDetails.push({
            key: "pickup-address",
            title: order.restaurant.location.formattedAddress,
            description: 'Pickup Address',
            icon: 'map-marker',
        });
    }

    if (role === USER_ROLES.customer || role === USER_ROLES.driver) {
        fulfilmentDetails.push({
            key: "vendor-phone",
            title: order.restaurant.phone,
            description: 'Vendor Phone',
            icon: "phone"
        });
    }

    const formattedOrder = formatOrder(order, role);

    const actionGroupButtonVariant = role === USER_ROLES.customer ? "button" : "fab";
    const buttonsMapping = formattedOrder.fulfilmentStatus.buttons.map(button => {
        if(button.value === ORDER_ACTIONS.print || ORDER_STATUS_CANCELLED(button.value)) {
            if(actionGroupButtonVariant === "button") {
                return {
                    ...button,
                    mode: "outlined"
                }
            } 

            if(button.value === ORDER_ACTIONS.print) {
                return {
                    ...button,
                    variant: "secondary"
                }
            } else {
                return {
                    ...button,
                    variant: "tertiary"
                }
            }   
        }

        return button;
    });


    const renderOrderActionButtons = ((onButtonPress && buttonsMapping.length > 0) ? (
        <ActionGroup.Group style={{margin: MD3LightTheme.spacing.x4}}>
            <ActionGroup.Buttons 
                variant={actionGroupButtonVariant}
                buttons={buttonsMapping}
                onPress={(button) => onButtonPress(button, formattedOrder.orderID)}  />
        </ActionGroup.Group>
    ) : null);

    return (
        <>
            <ScrollView  
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false} >
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
                                <View key={`product-item-${item.id}`}>
                                    <CartListProductItem data={item} />
                                    {itemSeparator(index, order.products.length) && <Divider />}
                                </View>
                            ))}
                        </List.Section>
                    )}

                    {fulfilmentDetails.length > 0 && (
                        <List.Section title={order.fulfillmentMethod === PUB.delivery ? 'Delivery Details' : 'Pickup Details'}>
                            {fulfilmentDetails.map((item, index) => (
                                <View key={item.key}>
                                    <List.Item 
                                        title={item.title} 
                                        description={item.description}
                                        left={(props) => <List.Icon {...props} icon={item.icon} />} />
                                    {itemSeparator(index, fulfilmentDetails.length) && <Divider />}
                                </View>
                            ))}
                        </List.Section>
                    )}

                    {driverDetails.length > 0 && (
                        <List.Section title={"Driver Details"}>
                            {driverDetails.map((item, index) => (
                                <View key={item.key}>
                                    <List.Item 
                                        title={item.title} 
                                        description={item.description}
                                        left={(props) => <List.Icon {...props} icon={item.icon} />} />
                                    {itemSeparator(index, driverDetails.length) && <Divider />}
                                </View>
                            ))}
                        </List.Section>
                    )}  

                    <ScreenWrapperSection>
                        <Accounting fees={formattedOrder.fees} />
                    </ScreenWrapperSection>
                {role === USER_ROLES.customer && renderOrderActionButtons}
                </View>
            </ScrollView>
      
            {role === USER_ROLES.vendor && renderOrderActionButtons}
        </>
    );
};

export default OrderView;
