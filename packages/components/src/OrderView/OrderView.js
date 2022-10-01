import React from 'react';

import {  Divider, List } from '@jmsstudiosinc/react-native-paper';

import { USER_ROLES } from '@jmsstudiosinc/user';
import {  PUB } from '@jmsstudiosinc/vendor';
import { ORDER_STATUS_CANCELLED, ORDER_STATUS, formatedOrderStatusTime } from '@jmsstudiosinc/order';

import Accounting from '../Checkout/Accounting';
import CartListProductItem from '../CartList/CartListProductItem';
import { FlatList } from 'react-native-gesture-handler';
import { formatOrder } from '../OrderList/utils';
import OrderStatus from '../OrderList/OrderStatus';
import OrderActionButtons from '../OrderList/OrderActionButtons';
import PhotoGallery from '../PhotoGallery/PhotoGallery';
import * as JMSList from "../List/List";

const OrderView = ({ order, role, onButtonPress }) => {
    const fulfilmentDetails = [];

    if (order.note === true) {
        fulfilmentDetails.push({
            title: order.cancelNote,
            description: 'Note',
        });
    }
  
    if ((order.status === ORDER_STATUS.completed || ORDER_STATUS_CANCELLED(order.status) === true)) {
        fulfilmentDetails.push({
            title: formatedOrderStatusTime(order),
            description: 'Date',
        });

        if(role === USER_ROLES.vendor || role === USER_ROLES.customer) {
            if (order.deliveryOption === PUB.delivery && order.driver) {
                fulfilmentDetails.push({
                    title: order.driver.deliveryMethod,
                    description: 'Fulfillment Method',
                });
    
                fulfilmentDetails.push({
                    title: order.driver?.formattedName,
                    description: 'Driver Name',
                });
            } else if (order.deliveryOption === PUB.pickup) {
               
                fulfilmentDetails.push({
                    title: order.deliveryMethod,
                    description: 'Fulfillment Method',
                });
            }
        }
    }

    if (role === USER_ROLES.vendor || role === USER_ROLES.driver) {
        fulfilmentDetails.push({
            title: `${order.author.firstName} ${order.author.lastName}`,
            description: 'Full Name',
        });

        if(order.deliveryOption === PUB.delivery) {
            fulfilmentDetails.push({
                title: order.shippingAddress.formattedAddress,
                description: 'Shipping Address',
            });
        }

        if(order.author.phone) {
            fulfilmentDetails.push({
                title: order.author.phone,
                description: 'Phone Number',
            });
        } 
    }

    if (role === USER_ROLES.customer && order.deliveryOption === PUB.pickup) {
        fulfilmentDetails.push({
            title: order.restaurant.address.formattedAddress,
            description: 'Pickup Address',
        });
    }

    const formattedOrder = formatOrder(order, role);

    return (
        <>
            {(role === USER_ROLES.customer || role === USER_ROLES.driver) ? (
                <PhotoGallery photos={[formattedOrder.photo]} />
            ) : null}

            <List.Section>
                <JMSList.ItemExtended
                    overline={[formattedOrder.formattedStatusTime].join(" · ") || null}
                    header={formattedOrder.title}
                    subHeader={order.status}
                    titleVariant={'headlineSmall'} />
                <OrderStatus
                    role={role}
                    status={formattedOrder.status}
                    deliveryMethod={formattedOrder.deliveryMethod}
                    driverAvatar={formattedOrder.driverAvatar}
                    durationValue={formattedOrder.durationValue}
                    deliveryTime={formattedOrder.deliveryTime}
                    restaurantAcceptedTime={formattedOrder.restaurantAcceptedTime}
                    orderID={formattedOrder.orderID}
                    fulfilmentStatus={formattedOrder.fulfilmentStatus}/>
            </List.Section>   
          
            <OrderActionButtons 
                orderID={formattedOrder.orderID}
                buttons={formattedOrder.fulfilmentStatus.driver.buttons}
                onPress={onButtonPress} />

            {(role === USER_ROLES.vendor || role === USER_ROLES.customer) && (
               <List.Section 
                    title={`Products · ${order.products.length} Items`} 
                    titleStyle={{paddingBottom: 0}}>
                    <FlatList 
                        data={order.products} 
                        ItemSeparatorComponent={Divider}
                        renderItem={({item}) => <CartListProductItem data={item} isRemoveable={false}/>}  />
                </List.Section>
            )}

            {fulfilmentDetails.length > 0 && (
                <List.Section title={order.deliveryOption === PUB.delivery ? 'Delivery Details' : 'Pickup Details'}>
                    {fulfilmentDetails.map((item) => (
                        <List.Item title={item.title} description={item.description} />
                    ))}
                </List.Section>
            )}

            <Accounting fees={formattedOrder.fees} />
        </>
    );
};

export default OrderView;
