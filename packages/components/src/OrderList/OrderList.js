import React from 'react';

import { SectionList } from 'react-native';

import { Divider, List, MD3LightTheme } from '@jmstechnologiesinc/react-native-paper';

import OrderListItem from './OrderListItem';
import { LAYOUT_MODE } from '../consts';

const keyExtractor = (order) => `order-list-${order.id}`;

const OrderList = ({ 
  data, 
  role, 
  currentOrderId,
  showItemSeparator = true,
  listHeaderComponent,
  listEmptyComponent,
  layoutMode = LAYOUT_MODE.portrait,
  showSelectedOverlay,
  
  enableDriverStatus,
  enableHeaderStatus,
  enableVendorStatus,
  
  showHeaderOverline,
  showHeaderTitle,
  showHeaderDescription,
  showHeaderAvatar,
  
  showVendorOverline,
  showVendorTitle,
  showVendorDescription,
  showVendorAvatar,

  showDriverOverline,
  showDriverTitle,
  showDriverDescription,
  showDriverAvatar,

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
    ItemSeparatorComponent={showItemSeparator ? Divider : null}
    renderItem={({ item }) => (
      <OrderListItem
          role={role}
          order={item}
          showSelectedOverlay={showSelectedOverlay}
          currentOrderId={currentOrderId}
        
          enableHeaderStatus={enableHeaderStatus}
          enableVendorStatus={enableVendorStatus}
          enableDriverStatus={enableDriverStatus}
  
          showHeaderOverline={showHeaderOverline}
          showHeaderTitle={showHeaderTitle}
          showHeaderDescription={showHeaderDescription}
          showHeaderAvatar={showHeaderAvatar}
          
          showVendorOverline={showVendorOverline}
          showVendorTitle={showVendorTitle}
          showVendorDescription={showVendorDescription}
          showVendorAvatar={showVendorAvatar}
      
          showDriverOverline={showDriverOverline}
          showDriverTitle={showDriverTitle}
          showDriverDescription={showDriverDescription}
          showDriverAvatar={showDriverAvatar}

          onButtonPress={onButtonPress}
          onPress={() => onPress(item, role)} />
    )}
  />
);

export default OrderList


