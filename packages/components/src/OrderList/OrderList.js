import React from 'react';

import { FlatList } from 'react-native';

import { Divider } from '@jmsstudiosinc/react-native-paper';

import OrderListItem from './OrderListItem';
import { itemSeparator as separator } from '../utils';

const keyExtractor = (order) => `order-list-${order.id}`;

const OrderList = ({ 
  data, 
  role, 
  currentOrderId,
  isCard,
  isExpanded,
  itemSeparator = true,
  onButtonPress,
  onPress 
}) => (
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
          isCard={isCard}
          currentOrderId={currentOrderId}
          isExpanded={isExpanded}
          onButtonPress={onButtonPress}
          onPress={() => onPress(item, role)} />
        {itemSeparator ? separator(index, data.length) && <Divider /> : null}
      </>
    )}
  />
);

export default OrderList


