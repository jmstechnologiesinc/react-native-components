import React from 'react';

import OrderList from './OrderList';
import { groupOrderList } from './utils';

import vendorMockData from './vendorMockData.json';

export default {
  title: 'packages/OrderList',
};

export const VendorList = () => (
  <OrderList data={groupOrderList(vendorMockData, 'vendor')} role="vendor"  onPress={() => {}}/>
);