import React from 'react';

import { FlatList } from 'react-native';

import { Divider } from '@jmsstudiosinc/react-native-paper';

import OrderListItem from './OrderListItem';
import { itemSeparator } from '../utils';

const keyExtractor = (order) => `order-list-${order.id}`;

const OrderList = ({ data, role, onButtonPress, onPress }) => (
  <FlatList
    keyExtractor={keyExtractor}
    data={data}
    showsVerticalScrollIndicator={false}
    showsHorizontalScrollIndicator={false}
    renderItem={({ item, index }) => (
      <>
        <OrderListItem
          role={role}
          order={item}
          onButtonPress={onButtonPress}
          onPress={() => onPress(item, role)} />
        {itemSeparator(index, data.length) && <Divider />}
      </>
    )}
  />
);

export default OrderList


