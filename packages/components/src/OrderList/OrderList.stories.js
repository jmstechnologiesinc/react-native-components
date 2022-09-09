import React from 'react';

import {ORDER_STATUS} from '@jmsstudiosinc/order';
import {DELIVERY_METHODS, PICKUP_METHODS, PUB} from '@jmsstudiosinc/vendor';

import OrderList from './OrderList';

import vendorMockData from './vendorMockData.json';
import driverMockData from './driverMockData.json';
import OrderListItem from './OrderListItem';

export default {
  title: 'packages/OrderList',
};

export const VendorList = () => (
  <OrderList data={vendorMockData} role="vendor" />
);
export const DriverList = () => (
  <OrderList data={driverMockData} role="driver" />
);
//export const Customer = () => <OrderList data={vendorMockData} role="customer" />

const renderOrderListItem = (vendorMockData, eta, role = 'vendor') => {
  return <OrderListItem isCard role={role} order={vendorMockData} eta={eta} />;
};

export const VendorNew = () =>
  renderOrderListItem({...vendorMockData[0], status: ORDER_STATUS.placed});
export const VendorCancelled = () => renderOrderListItem(vendorMockData[0]);
export const VendorCompletedStaff = () =>
  renderOrderListItem(vendorMockData[2]);
export const VendorInTransitStaff = () =>
  renderOrderListItem(vendorMockData[1], '45 Mins');
export const VendorInTransitMarkeplace = () =>
  renderOrderListItem(vendorMockData[3], '27 Mins');
export const VendorDriverAccepted = () =>
  renderOrderListItem({
    ...vendorMockData[3],
    status: ORDER_STATUS.driverAccepted,
    deliveryMethod: DELIVERY_METHODS.marketPlace,
  });
export const VendorPickupComplete = () =>
  renderOrderListItem({
    ...vendorMockData[2],
    deliveryMethod: PICKUP_METHODS.customerPickup,
    deliveryOption: PUB.pickup,
  });
export const VendorPickupAccepted = () =>
  renderOrderListItem({
    ...vendorMockData[1],
    status: ORDER_STATUS.restaurantAccepted,
    deliveryMethod: PICKUP_METHODS.customerPickup,
    deliveryOption: PUB.pickup,
  });
export const VendorPickupReadyForPickup = () =>
  renderOrderListItem({
    ...vendorMockData[1],
    status: ORDER_STATUS.readyforPickup,
    deliveryMethod: PICKUP_METHODS.customerPickup,
    deliveryOption: PUB.pickup,
  });
export const VendorDriverRejected = () =>
  renderOrderListItem({
    ...vendorMockData[1],
    status: ORDER_STATUS.driverRejected,
  });
export const VendorDriverPending = () =>
  renderOrderListItem({
    ...vendorMockData[1],
    status: ORDER_STATUS.driverPending,
  });
export const VendorDriverShipped = () =>
  renderOrderListItem({...vendorMockData[1], status: ORDER_STATUS.shipped});

export const DriverCancelled = () =>
  renderOrderListItem(vendorMockData[0], null, (role = 'driver'));
export const DriverCompletedStaff = () =>
  renderOrderListItem(vendorMockData[2], null, (role = 'driver'));
export const DriverInTransitStaff = () =>
  renderOrderListItem(vendorMockData[1], '45 Mins', (role = 'driver'));
export const DriverInTransitMarkeplace = () =>
  renderOrderListItem(vendorMockData[3], '27 Mins', (role = 'driver'));
export const DriverDriverAccepted = () =>
  renderOrderListItem(
    {
      ...vendorMockData[3],
      status: ORDER_STATUS.driverAccepted,
      deliveryMethod: DELIVERY_METHODS.marketPlace,
    },
    null,
    (role = 'driver'),
  );
export const DriverDriverRejected = () =>
  renderOrderListItem(
    {...vendorMockData[1], status: ORDER_STATUS.driverRejected},
    null,
    (role = 'driver'),
  );
export const DriverDriverPending = () =>
  renderOrderListItem(
    {...vendorMockData[1], status: ORDER_STATUS.driverPending},
    null,
    (role = 'driver'),
  );
export const DriverDriverShipped = () =>
  renderOrderListItem(
    {...vendorMockData[1], status: ORDER_STATUS.shipped},
    null,
    (role = 'driver'),
  );
