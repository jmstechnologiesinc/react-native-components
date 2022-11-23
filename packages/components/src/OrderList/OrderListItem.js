import React from 'react';

import color from 'color';

import { Card, List, MD3LightTheme, TouchableRipple } from '@jmsstudiosinc/react-native-paper';

import { formatOrder } from './utils';
import OrderStatus from './OrderStatus';
import * as ActionGroup from '../ActionGroup/ActionGroup';
import { moderateScale } from 'react-native-size-matters';

const OrderListItem = ({
  role,
  order,
  isCard = false,
  isExpanded = false,
  currentOrderId,
  onButtonPress,
  onPress,
  style
}) => {
  const formattedOrder = formatOrder(order, role);
    
  const isSelected =  currentOrderId === order?.id;
  const borderRadius = moderateScale(7);
  const backgroundColor = isSelected
    ? MD3LightTheme.colors.secondaryContainer
    : 'transparent';
  const contentColor = MD3LightTheme.colors.onSecondaryContainer;
  const underlayColor = color(backgroundColor)
    .mix(color(MD3LightTheme.colors.onSecondaryContainer), 0.16)
    .rgb()
    .toString();

  const renderStatusItem = (
    <>
      <OrderStatus
          role={role}
          isExpanded={isExpanded}
          status={formattedOrder.status}
          deliveryMethod={formattedOrder.deliveryMethod}
          durationValue={formattedOrder.durationValue}
          deliveryTime={formattedOrder.deliveryTime}
          restaurantAcceptedTime={formattedOrder.restaurantAcceptedTime}
          orderID={formattedOrder.orderID}
          fulfilmentStatus={formattedOrder.fulfilmentStatus} 
          showHeaderAvatar
          contentColor={isSelected && {color: contentColor}} />
        {onButtonPress && <List.Section>
            <ActionGroup.Group>
                <ActionGroup.Buttons 
                    buttons={formattedOrder.fulfilmentStatus.buttons}
                    onPress={(button) => onButtonPress(button, order.id)}  />
            </ActionGroup.Group>
        </List.Section>}
    </>
  );

  return isCard ? (
    <Card 
      onPress={onPress} 
      mode={isSelected ? "contained" : ""}
      style={{ marginBottom: MD3LightTheme.spacing.x2 }}>
      {renderStatusItem}
    </Card>
  ) : (
    <TouchableRipple
      borderless
      delayPressIn={0}
      style={[isSelected && {backgroundColor}, {borderRadius}, style]}
      underlayColor={underlayColor}
      onPress={onPress}>
        {renderStatusItem}
    </TouchableRipple>  
  )
}

export default OrderListItem;
