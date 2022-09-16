import React from 'react';

import { FlatList } from 'react-native';

import OrderListItem from './OrderListItem';

const OrderList = ({ data, role, onButtonPress }) => (
  <FlatList
    data={data}
    renderItem={({ item}) => (
      <OrderListItem
        isCard
        showAvatar
        role={role}
        order={item}
        onButtonPress={onButtonPress}

      />
    )}
  />
);

export default OrderList


