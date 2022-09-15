import React from 'react';

import { List } from '@jmsstudiosinc/react-native-paper';

import { USER_ROLES } from '@jmsstudiosinc/user';
import { DELIVERY_METHODS, PUB } from '@jmsstudiosinc/vendor';
import { ORDER_STATUS_CANCELLED, ORDER_STATUS } from '@jmsstudiosinc/order';

import PhotoGallery from '../PhotoGallery/PhotoGallery';
import OrderListItem from '../OrderList/OrderListItem';
import Accounting from '../Checkout/Accounting';
import CartListProductItem from '../CartList/CartListProductItem';
import { Subheader } from '../List';

const OrderView = ({ order, role,  onButtonPress }) => {
    const fulfilmentDetails = [];

    if (order.note === true) {
        fulfilmentDetails.push({
            title: order.cancelNote,
            description: 'Note',
        });
    }

    if (
        (order.status === ORDER_STATUS.completed || ORDER_STATUS_CANCELLED(order.status) === true) &&
        (role === USER_ROLES.vendor || role === USER_ROLES.customer)
    ) {
        if (order.deliveryOption === PUB.delivery && order.driver) {
            fulfilmentDetails.push({
                title: order.driver.deliveryMethod,
                description: 'Fulfillment Method',
            });

            fulfilmentDetails.push({
                title: order.driver?.name,
                description: 'Driver',
            });
        } else if (order.deliveryOption === PUB.pickup) {
            fulfilmentDetails.push({
                title: order.deliveryMethod,
                description: 'Fulfillment Method',
            });
        }
    }

    if ((role === USER_ROLES.vendor || role === USER_ROLES.driver) && order.deliveryOption === PUB.delivery) {
        fulfilmentDetails.push({
            title: order.shippingAddress.formattedAddress,
            description: 'Shipping Address',
        });
    }

    if (role === USER_ROLES.customer && order.deliveryOption === PUB.pickup) {
        fulfilmentDetails.push({
            title: order.restaurant.address.formattedAddress,
            description: 'Pickup Address',
        });
    }

    if ((role === USER_ROLES.vendor || role === USER_ROLES.driver) && order.author.phone) {
        fulfilmentDetails.push({
            title: order.author.phone,
            description: 'Customer Phone Number',
        });
    }

    return (
        <>
            <PhotoGallery photos={[]} />
            <OrderListItem role={role} order={order}   onButtonPress={onButtonPress}/>

            {(role === USER_ROLES.vendor || role === USER_ROLES.customer) && (
                <>
                    <List.Section title="Products">
                        {order.products.map((data) => (
                            <CartListProductItem data={data} />
                        ))}
                    </List.Section>
                </>
            )}

            {fulfilmentDetails.length > 0 && (
                <List.Section title={order.deliveryOption === PUB.delivery ? 'Delivery Details' : 'Pickup Details'}>
                    {/*   {(order.status === ORDER_STATUS.completed || ORDER_STATUS_CANCELLED(order.status) === true) && (
                    <List.Item 
                        title={formatedOrderStatusTime(order)} 
                        description={"Date"} />
                )} */}

                    {fulfilmentDetails.map((item) => (
                        <List.Item title={item.title} description={item.description} />
                    ))}
                </List.Section>
            )}

            {/*     {!(role === USER_ROLES.driver && order.deliveryMethod === DELIVERY_METHODS.restaurantOwnStaff) && (
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
            )} */}
        </>
    );
};

export default OrderView;
