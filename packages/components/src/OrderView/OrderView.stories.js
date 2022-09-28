import React from 'react';

import { ORDER_STATUS, NONFULFILLMENT_ORDER_STATUS, PICKUP_ORDER_STATUS, DELIVERY_ORDER_STATUS } from '@jmsstudiosinc/order';
import { DELIVERY_METHODS, PICKUP_METHODS, PUB } from '@jmsstudiosinc/vendor';
import { USER_ROLES } from '@jmsstudiosinc/user';

import vendorMockData from '../OrderList/vendorMockData.json';
import driverMockData from '../OrderList/driverMockData.json';

import OrderView from './OrderView';

export default {
    title: 'packages/OrderView',
    argTypes: {
        role: {
            name: 'Roles',
            control: 'radio',
            options: [USER_ROLES.vendor, USER_ROLES.customer, USER_ROLES.driver],
        },
        acceptedTime: {
            control: {
                type: "select",
                labels: {
                    5: "5 Mins",
                    15: "15 Mins",
                    30: "30 Mins",
                    60: "1 Hour"
                },
            },
            options: [5, 15, 30, 60]
        },
    },
};

function subtractMinutes(numOfMinutes, date = new Date()) {
    date.setMinutes(date.getMinutes() - numOfMinutes);
 
    return {seconds: date.getTime() / 1000};
}

const Template = (args) => {
    return <OrderView 
        role={args.role || USER_ROLES.vendor} 
        order={{
            ...vendorMockData[3], 
            restaurantAcceptedTime: subtractMinutes(args.acceptedTime || 5),
            ...args
        }} />
}

export const Delivery = Template.bind({});
export const Pickup = Template.bind({});

Delivery.args = {
    role: USER_ROLES.vendor,
    status: ORDER_STATUS.placed,
    deliveryMethod: DELIVERY_METHODS.marketPlace,
    deliveryOption: PUB.delivery,
    acceptedTime: 5
};

Delivery.argTypes = {
    status: {
        control: 'select',
        options: [...NONFULFILLMENT_ORDER_STATUS, ...DELIVERY_ORDER_STATUS],
    },
    deliveryMethod: {
        name: "Fulfillment Method",
        control: 'radio',
        options: [DELIVERY_METHODS.restaurantOwnStaff, DELIVERY_METHODS.marketPlace],
    },
    deliveryOption: {
        control: 'radio',
        options: [PUB.delivery],
        disabled: true
    }
}

Pickup.args = {
    role: USER_ROLES.vendor,
    status: ORDER_STATUS.placed,
    deliveryMethod: PICKUP_METHODS.customerPickup,
    deliveryOption: PUB.pickup
};

Pickup.argTypes = {
    status: {
        control: 'select',
        options: [...NONFULFILLMENT_ORDER_STATUS, ...PICKUP_ORDER_STATUS],
    },
    deliveryMethod: {
        name: "Fulfillment Method",
        control: 'radio',
        options: [
            PICKUP_METHODS.customerPickup
        ],
    },
    deliveryOption: {
        control: 'radio',
        options: [PUB.pickup],
        disabled: true
    },
}
