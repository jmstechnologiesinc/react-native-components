import React from 'react';

import { FlatList } from 'react-native';

import OrderListItem from './OrderListItem';

const OrderList = ({data, role}) => (
  <FlatList 
    data={data}
    renderItem={({item}) => (
      <OrderListItem 
        isCard
        showAvatar
        role={role}
        order={item} />
    )}
  />
);

export default OrderList


