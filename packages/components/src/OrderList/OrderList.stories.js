import React from 'react';


import OrderList from './OrderList';

import vendorMockData from './vendorMockData.json';
import driverMockData from './driverMockData.json';

export default {
  title: 'packages/OrderList',
};

export const VendorList = () => (
  <OrderList data={vendorMockData} role="vendor"  onPress={() => {}}/>
);
export const DriverList = () => (
  <OrderList data={driverMockData} role="driver"  onPress={() => {}}/>
);
