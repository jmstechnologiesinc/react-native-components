import React from 'react';

import OrderList from './OrderList';
import { groupOrderList } from '../Order/utils';

import vendorMockData from '../Order/vendorMockData.json';

export default {
  title: 'packages/OrderList',
};

export const VendorList = () => (
  <OrderList data={groupOrderList(vendorMockData, 'vendor')} role="vendor"  onPress={() => {}}/>
);