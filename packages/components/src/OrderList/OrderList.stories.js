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
  <OrderList data={vendorMockData} role="vendor"  onPress={() => {}}/>
);
export const DriverList = () => (
  <OrderList data={driverMockData} role="driver"  onPress={() => {}}/>
);
//export const Customer = () => <OrderList data={vendorMockData} role="customer" />

const renderOrderListItem = (vendorMockData, eta, role = 'vendor') => {
  return <OrderListItem isCard role={role} order={vendorMockData} eta={eta} onPress={() => {}} />;
};
