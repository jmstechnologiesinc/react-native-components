import React from 'react';

import { ORDER_STATUS, NONFULFILLMENT_ORDER_STATUS, PICKUP_ORDER_STATUS, DELIVERY_ORDER_STATUS } from '@jmstechnologiesinc/order';
import { DELIVERY_METHODS, PICKUP_METHODS, FULFILLMENT_METHODS } from '@jmstechnologiesinc/vendor';
import { USER_ROLES } from '@jmstechnologiesinc/user';

import vendorMockData from '../Order/vendorMockData.json';

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
        onButtonPress={() => {}}
        order={{
            ...vendorMockData[3], 
            vendorAcceptedTime: subtractMinutes(args.acceptedTime || 5),
            ...args
        }} />
}

export const Delivery = Template.bind({});
export const Pickup = Template.bind({});

Delivery.args = {
    role: USER_ROLES.vendor,
    status: ORDER_STATUS.placed,
    deliveryMethod: DELIVERY_METHODS.marketPlace,
    fulfillmentMethod: FULFILLMENT_METHODS.delivery,
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
        options: [DELIVERY_METHODS.ownStaff, DELIVERY_METHODS.marketPlace],
    },
    fulfillmentMethod: {
        control: 'radio',
        options: [FULFILLMENT_METHODS.delivery],
        disabled: true
    }
}

Pickup.args = {
    role: USER_ROLES.vendor,
    status: ORDER_STATUS.placed,
    deliveryMethod: PICKUP_METHODS.customerPickup,
    fulfillmentMethod: FULFILLMENT_METHODS.pickup
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
    fulfillmentMethod: {
        control: 'radio',
        options: [FULFILLMENT_METHODS.pickup],
        disabled: true
    },
}
