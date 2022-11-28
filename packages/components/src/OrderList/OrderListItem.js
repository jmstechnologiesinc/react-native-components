import React from 'react';

import {  List, MD3LightTheme, TouchableRipple } from '@jmsstudiosinc/react-native-paper';

import { ORDER_STATUS, ORDER_STATUS_CANCELLED, ORDER_STATUS_PREPARING } from '@jmsstudiosinc/order';
import { formatOrder } from '../Order/utils';
import OrderStatus from '../Order/OrderStatus';
import * as ActionGroup from '../ActionGroup/ActionGroup';
import TouchableRippleWrapper from '../TouchableRippleWrapper/TouchableRippleWrapper';

const OrderListItem = ({
  role,
  order,
  currentOrderId,
  showSelectedOverlay = false,
  showDriverStatus,
  showVendorStatus,
  onButtonPress,
  onPress,
}) => {
  const formattedOrder = formatOrder(order, role);

  const showHeaderDescription = (ORDER_STATUS_PREPARING(formattedOrder.status) || formattedOrder.status === ORDER_STATUS.shipped) || 
    ORDER_STATUS_CANCELLED(formattedOrder.status) || 
    formattedOrder.status === ORDER_STATUS.completed;

  const isSelected = (currentOrderId === order?.id && showSelectedOverlay);
  const contentColor = isSelected ? {color: MD3LightTheme.colors.onSecondaryContainer} : null;
  
  const renderStatus = (
    <>
      <OrderStatus
        role={role}
        formattedOrder={formattedOrder} 
    
        showHeaderDescription={showHeaderDescription}
        showVendorOverline={false}
        showDriverStatus={showDriverStatus}
        showVendorStatus={showVendorStatus}
        showHeaderAvatar
        titleStyle={contentColor}
        overlineStyle={contentColor}/>
        {onButtonPress && <List.Section>
            <ActionGroup.Group>
                <ActionGroup.Buttons 
                    buttons={formattedOrder.fulfilmentStatus.buttons}
                    onPress={(button) => onButtonPress(button, order.id)}  />
            </ActionGroup.Group>
        </List.Section>}
    </>
  );

  return showSelectedOverlay ? (
    <TouchableRippleWrapper
      isSelected={isSelected}
      onPress={onPress}>
        {renderStatus}
    </TouchableRippleWrapper>  
  ) : <TouchableRipple
    onPress={onPress}>
      {renderStatus}
  </TouchableRipple>  
}

export default OrderListItem;
