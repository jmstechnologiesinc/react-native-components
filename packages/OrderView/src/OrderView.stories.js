import React from 'react';

import { ORDER_STATUS } from "@jmsstudiosinc/order";
import { DELIVERY_METHODS, PICKUP_METHODS, PUB } from '@jmsstudiosinc/vendor';

import vendorMockData from "../../OrderList/src/vendorMockData.json";
import driverMockData from "../../OrderList/src/driverMockData.json";

import OrderView from './OrderView';

export default {
  title: 'packages/OrderView'
};

const renderOrderListItem = (mockData, eta, role="vendor") => {
  return <OrderView  order={mockData} role={role} />
}

export const VendorNew = () => renderOrderListItem({...vendorMockData[0], status: ORDER_STATUS.placed});
export const VendorNewPickup = () => renderOrderListItem({...vendorMockData[0], status: ORDER_STATUS.placed, deliveryMethod: PICKUP_METHODS.customerPickup, deliveryOption: PUB.pickup})
export const VendorCancelled = () => renderOrderListItem(vendorMockData[0])
export const VendorCompletedStaff = () => renderOrderListItem(vendorMockData[2]);
export const VendorInTransitStaff = () => renderOrderListItem(vendorMockData[1], '45 Mins')
export const VendorInTransitMarkeplace = () => renderOrderListItem(vendorMockData[3], '27 Mins');
export const VendorDriverAccepted = () => renderOrderListItem({...vendorMockData[3], status: ORDER_STATUS.driverAccepted, deliveryMethod: DELIVERY_METHODS.marketPlace})
export const VendorPickupComplete = () => renderOrderListItem({...vendorMockData[2], deliveryMethod: PICKUP_METHODS.customerPickup, deliveryOption: PUB.pickup})
export const VendorPickupAccepted = () => renderOrderListItem({...vendorMockData[1], status: ORDER_STATUS.restaurantAccepted, deliveryMethod: PICKUP_METHODS.customerPickup, deliveryOption: PUB.pickup})
export const VendorPickupReadyForPickup = () => renderOrderListItem({...vendorMockData[1], status: ORDER_STATUS.readyforPickup, deliveryMethod: PICKUP_METHODS.customerPickup, deliveryOption: PUB.pickup})
export const VendorDriverRejected = () => renderOrderListItem({...vendorMockData[1], status: ORDER_STATUS.driverRejected})
export const VendorDriverPending = () => renderOrderListItem({...vendorMockData[1], status: ORDER_STATUS.driverPending})
export const VendorDriverShipped = () => renderOrderListItem({...vendorMockData[1], status: ORDER_STATUS.shipped})

export const DriverCancelled = () => renderOrderListItem(vendorMockData[0], null, "driver")
export const DriverCompletedStaff = () => renderOrderListItem(vendorMockData[2], null, "driver");
export const DriverInTransitStaff = () => renderOrderListItem(vendorMockData[1], '45 Mins', "driver")
export const DriverInTransitMarkeplace = () => renderOrderListItem(vendorMockData[3], '27 Mins', "driver");
export const DriverDriverAccepted = () => renderOrderListItem({...vendorMockData[3], status: ORDER_STATUS.driverAccepted, deliveryMethod: DELIVERY_METHODS.marketPlace}, null, "driver")
export const DriverDriverRejected = () => renderOrderListItem({...vendorMockData[1], status: ORDER_STATUS.driverRejected}, null, "driver")
export const DriverDriverPending = () => renderOrderListItem({...vendorMockData[1], status: ORDER_STATUS.driverPending}, null, "driver")
export const DriverDriverShipped = () => renderOrderListItem({...vendorMockData[1], status: ORDER_STATUS.shipped}, null, "driver")

export const CustomerNew = () => renderOrderListItem({...vendorMockData[0], status: ORDER_STATUS.placed}, null, "customer");
export const CustomerNewPickup = () => renderOrderListItem({...vendorMockData[0], status: ORDER_STATUS.placed, deliveryMethod: PICKUP_METHODS.customerPickup, deliveryOption: PUB.pickup}, null, "customer")
export const CustomerCancelled = () => renderOrderListItem(vendorMockData[0], null, "customer")
export const CustomerCompletedStaff = () => renderOrderListItem(vendorMockData[2], null, "customer");
export const CustomerInTransitStaff = () => renderOrderListItem(vendorMockData[1], '45 Mins', "customer")
export const CustomerInTransitMarkeplace = () => renderOrderListItem(vendorMockData[3], '27 Mins',  "customer");
export const CustomerriverAccepted = () => renderOrderListItem({...vendorMockData[3], status: ORDER_STATUS.driverAccepted, deliveryMethod: DELIVERY_METHODS.marketPlace}, null, "customer")
export const CustomerPickupComplete = () => renderOrderListItem({...vendorMockData[2], deliveryMethod: PICKUP_METHODS.customerPickup, deliveryOption: PUB.pickup}, null, "customer")
export const CustomerPickupAccepted = () => renderOrderListItem({...vendorMockData[1], status: ORDER_STATUS.restaurantAccepted, deliveryMethod: PICKUP_METHODS.customerPickup, deliveryOption: PUB.pickup}, null, "customer")
export const CustomerPickupReadyForPickup = () => renderOrderListItem({...vendorMockData[1], status: ORDER_STATUS.readyforPickup, deliveryMethod: PICKUP_METHODS.customerPickup, deliveryOption: PUB.pickup}, null, "customer")
export const CustomerDriverRejected = () => renderOrderListItem({...vendorMockData[1], status: ORDER_STATUS.driverRejected}, null, "customer")
export const CustomerDriverPending = () => renderOrderListItem({...vendorMockData[1], status: ORDER_STATUS.driverPending}, null, "customer")
export const CustomerDriverShipped = () => renderOrderListItem({...vendorMockData[1], status: ORDER_STATUS.shipped}, null, "customer")

