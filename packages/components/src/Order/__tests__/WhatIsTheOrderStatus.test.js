// The vendor's lifecycle buttons on a DELIVERY order between the vendor's
// acceptance and the driver's dispatch (ADR-0014 `ready`, ADR-0016 deferred
// dispatch): the table used to name no vendor case for `Vendor Accepted` /
// `Ready for Pickup` under marketplace, and returned undefined — no buttons.
jest.mock('../../Localization/Localization', () => ({ localized: (key) => key }));

import { DELIVERY_METHODS, PICKUP_METHODS, FULFILLMENT_METHODS } from '@jmstechnologiesinc/vendor';
import { USER_ROLES } from '@jmstechnologiesinc/user';
import { ITEM_TYPE } from '@jmstechnologiesinc/commons';
import { ORDER_STATUS } from '@jmstechnologiesinc/order';

import { whatIsTheOrderStatus } from '../WhatIsTheOrderStatus';

const vendor = (order) => whatIsTheOrderStatus({ order, role: USER_ROLES.vendor });
const values = (result) => result?.buttons?.map((button) => button.value);

const delivery = (deliveryMethod, status) => ({
    status,
    deliveryMethod,
    fulfillmentMethod: FULFILLMENT_METHODS.delivery,
});

describe('whatIsTheOrderStatus — vendor, delivery, before the dispatch', () => {
    it.each([DELIVERY_METHODS.marketPlace, DELIVERY_METHODS.ownStaff, DELIVERY_METHODS.flexible])(
        'Vendor Accepted under %s: cancel, receipt and READY (the `ready` intent advances the dispatch)',
        (deliveryMethod) => {
            const result = vendor(delivery(deliveryMethod, ORDER_STATUS.vendorAccepted));

            expect(values(result)).toEqual([
                ORDER_STATUS.vendorCancelled,
                ITEM_TYPE.print,
                ORDER_STATUS.readyforPickup,
            ]);
            expect(result.formattedTripStatus).toBe('order.readyForDeliveryReminder');
            expect(result.items.map((item) => item.type)).toEqual([ITEM_TYPE.driver, ITEM_TYPE.needAttention]);
        }
    );

    it.each([
        [DELIVERY_METHODS.marketPlace, 'order.lookingForDriver'],
        [DELIVERY_METHODS.ownStaff, 'order.lookingForStaff'],
        [DELIVERY_METHODS.flexible, 'order.lookingForDriver'],
    ])('Ready for Pickup under %s: cancel and receipt while the dispatch is requested', (deliveryMethod, status) => {
        const result = vendor(delivery(deliveryMethod, ORDER_STATUS.readyforPickup));

        expect(values(result)).toEqual([ORDER_STATUS.vendorCancelled, ITEM_TYPE.print]);
        expect(result.formattedTripStatus).toBe(status);
    });
});

describe('whatIsTheOrderStatus — what did not move', () => {
    it('vendor, marketplace, Driver Pending: cancel and receipt', () => {
        const result = vendor(delivery(DELIVERY_METHODS.marketPlace, ORDER_STATUS.driverPending));

        expect(values(result)).toEqual([ORDER_STATUS.vendorCancelled, ITEM_TYPE.print]);
        expect(result.formattedTripStatus).toBe('order.driverPending');
    });

    it('vendor, own staff, Driver Rejected: cancel and receipt, re-assigning', () => {
        const result = vendor(delivery(DELIVERY_METHODS.ownStaff, ORDER_STATUS.driverRejected));

        expect(values(result)).toEqual([ORDER_STATUS.vendorCancelled, ITEM_TYPE.print]);
        expect(result.formattedTripStatus).toBe('order.staffReassigning');
    });

    it('vendor, flexible, Driver Rejected: looking for another driver', () => {
        const result = vendor(delivery(DELIVERY_METHODS.flexible, ORDER_STATUS.driverRejected));

        expect(values(result)).toEqual([ORDER_STATUS.vendorCancelled, ITEM_TYPE.print]);
        expect(result.formattedTripStatus).toBe('order.lookingForAnotherDriver');
    });

    it('vendor, customer pickup, Vendor Accepted: the pickup ready button as before', () => {
        const result = vendor({
            status: ORDER_STATUS.vendorAccepted,
            fulfillmentMethod: FULFILLMENT_METHODS.pickup,
            pickupMethod: PICKUP_METHODS.customerPickup,
        });

        expect(values(result)).toEqual([ORDER_STATUS.vendorCancelled, ITEM_TYPE.print, ORDER_STATUS.readyforPickup]);
        expect(result.formattedTripStatus).toBe('order.readyForPickupReminder');
    });

    it('vendor, Placed: reject and accept', () => {
        const result = vendor(delivery(DELIVERY_METHODS.marketPlace, ORDER_STATUS.placed));

        expect(values(result)).toEqual([ORDER_STATUS.vendorRejected, ORDER_STATUS.vendorAccepted]);
    });

    it('customer, marketplace, Vendor Accepted: unchanged (cancel only)', () => {
        const result = whatIsTheOrderStatus({
            order: delivery(DELIVERY_METHODS.marketPlace, ORDER_STATUS.vendorAccepted),
            role: USER_ROLES.customer,
        });

        expect(values(result)).toEqual([ORDER_STATUS.customerCancelled]);
    });
});
