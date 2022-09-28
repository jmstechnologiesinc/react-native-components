import React from 'react';

import {  Divider, List } from '@jmsstudiosinc/react-native-paper';

import { USER_ROLES } from '@jmsstudiosinc/user';
import { DELIVERY_METHODS, PUB } from '@jmsstudiosinc/vendor';
import { ORDER_STATUS_CANCELLED, ORDER_STATUS, formatedOrderStatusTime } from '@jmsstudiosinc/order';

import OrderListItem from '../OrderList/OrderListItem';
import Accounting from '../Checkout/Accounting';
import CartListProductItem from '../CartList/CartListProductItem';
import { FlatList } from 'react-native-gesture-handler';

const OrderView = ({ order, role }) => {
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

    return (
        <>
            <OrderListItem role={role} order={order} />

            {(role === USER_ROLES.vendor || role === USER_ROLES.customer) && (
               <List.Section 
                    title={`${order.products.length} - Products`} 
                    description={``} 
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

            {!(role === USER_ROLES.driver && order.deliveryMethod === DELIVERY_METHODS.restaurantOwnStaff) && (
                <Accounting 
                    fees={(role === USER_ROLES.customer
                        ? order.customerFees
                        : role === USER_ROLES.vendor
                        ? order.restaurantFees
                        : !(
                            role.role === USER_ROLES.driver &&
                            order.deliveryMethod === DELIVERY_METHODS.restaurantOwnStaff
                        )
                        ? order.driverFees
                        : null
                    )} />
            )}
        </>
    );
};

export default OrderView;
