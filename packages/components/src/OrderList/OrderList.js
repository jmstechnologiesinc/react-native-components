import React from 'react';

import { SectionList } from 'react-native';

import { Divider, List, MD3LightTheme } from '@jmsstudiosinc/react-native-paper';

import OrderListItem from './OrderListItem';

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
  <SectionList
    keyExtractor={keyExtractor}
    sections={data}
    showsVerticalScrollIndicator={false}
    showsHorizontalScrollIndicator={false}
    renderSectionHeader={({ section: { title } }) => <List.Subheader style={{backgroundColor: MD3LightTheme.colors.background}}>{title}</List.Subheader>}
    ItemSeparatorComponent={itemSeparator ? Divider : null}
    renderItem={({ item }) => (
      <OrderListItem
          role={role}
          order={item}
          isCard={isCard}
          currentOrderId={currentOrderId}
          isExpanded={isExpanded}
          onButtonPress={onButtonPress}
          onPress={() => onPress(item, role)} />
    )}
  />
);

export default OrderList


