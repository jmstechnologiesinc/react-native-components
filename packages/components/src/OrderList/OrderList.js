import React from 'react';

import { FlatList } from 'react-native';

import OrderListItem from './OrderListItem';

const OrderList = ({ data, role, onButtonPress, onPress }) => (
  <FlatList
    data={data}
    renderItem={({ item }) => (
      <OrderListItem
        role={role}
        order={item}
        onPress={onPress}
        onButtonPress={onButtonPress} />
    )}
    showsVerticalScrollIndicator={false}
    showsHorizontalScrollIndicator={false}
  />
);

export default OrderList


