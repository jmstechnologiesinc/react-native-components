import React from 'react';

import { FlatList } from 'react-native';

import OrderListItem from './OrderListItem';

const OrderList = ({ data, role, onButtonPress, onPress }) => (
  <FlatList
    data={data}
    renderItem={({ item}) => (
      <OrderListItem
        isCard
        showAvatar
        role={role}
        order={item}
        onButtonPress={onButtonPress}
        onPress={onPress}

      />
    )}
  />
);

export default OrderList


