import React from 'react';

import color from 'color';

import {  List, MD3LightTheme, TouchableRipple } from '@jmsstudiosinc/react-native-paper';

import { formatOrder } from './utils';
import OrderStatus from './OrderStatus';
import * as ActionGroup from '../ActionGroup/ActionGroup';
import { moderateScale } from 'react-native-size-matters';

const OrderListItem = ({
  role,
  order,
  showDriverStatus,
  showVendorStatus,
  currentOrderId,
  showSelectedOverlay = false,
  onButtonPress,
  onPress,
  style
}) => {
  const formattedOrder = formatOrder(order, role);
    
    const isSelected =  currentOrderId === order?.id;
    let borderRadius;
    let backgroundColor;
    let contentColor;
    let underlayColor;

  if(showSelectedOverlay && isSelected) {
    borderRadius = moderateScale(7);
    backgroundColor = isSelected
      ? MD3LightTheme.colors.secondaryContainer
      : 'transparent';
    contentColor = {color: MD3LightTheme.colors.onSecondaryContainer};
    underlayColor = color(backgroundColor)
      .mix(color(MD3LightTheme.colors.onSecondaryContainer), 0.16)
      .rgb()
      .toString();  
  }

  const renderStatusItem = (
    <>
      <OrderStatus
        role={role}
        status={formattedOrder.status}
        deliveryMethod={formattedOrder.deliveryMethod}
        durationValue={formattedOrder.durationValue}
        deliveryTime={formattedOrder.deliveryTime}
        restaurantAcceptedTime={formattedOrder.restaurantAcceptedTime}
        orderID={formattedOrder.orderID}
        fulfilmentStatus={formattedOrder.fulfilmentStatus} 
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

  return (
    <TouchableRipple
      borderless
      delayPressIn={0}
      style={[{backgroundColor, borderRadius},  style]}
      underlayColor={underlayColor}
      onPress={onPress}>
        {renderStatusItem}
    </TouchableRipple>  
  )
}

export default OrderListItem;
