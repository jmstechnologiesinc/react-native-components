import React from 'react';

import { SectionList } from 'react-native';

import { Divider, List, MD3LightTheme } from '@jmsstudiosinc/react-native-paper';

import OrderListItem from './OrderListItem';
import { LAYOUT_MODE } from '../consts';

const keyExtractor = (order) => `order-list-${order.id}`;

const OrderList = ({ 
  data, 
  role, 
  currentOrderId,
  itemSeparator = true,
  listHeaderComponent,
  listEmptyComponent,
  layoutMode = LAYOUT_MODE.portrait,
  showSelectedOverlay,
  showDriverStatus,
  showVendorStatus,
  onButtonPress,
  onPress 
}) => (
  <SectionList
    keyExtractor={keyExtractor}
    sections={data}
    showsVerticalScrollIndicator={false}
    showsHorizontalScrollIndicator={false}
    ListHeaderComponent={listHeaderComponent}
    ListEmptyComponent={listEmptyComponent}
    renderSectionHeader={({ section: { title } }) => title !== null ? (
      <List.Subheader style={{
        ...(layoutMode === LAYOUT_MODE.landscape && {paddingHorizontal: 0}),
        backgroundColor: MD3LightTheme.colors.background}}>
        {title}
      </List.Subheader>
    ) : null}
    ItemSeparatorComponent={itemSeparator ? Divider : null}
    renderItem={({ item }) => (
      <OrderListItem
          role={role}
          order={item}
          showSelectedOverlay={showSelectedOverlay}
          currentOrderId={currentOrderId}
          showDriverStatus={showDriverStatus}
          showVendorStatus={showVendorStatus}
          onButtonPress={onButtonPress}
          onPress={() => onPress(item, role)} />
    )}
  />
);

export default OrderList


