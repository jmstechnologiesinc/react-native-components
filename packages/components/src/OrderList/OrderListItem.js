import React from 'react';

import { List, TouchableRipple } from '@jmsstudiosinc/react-native-paper';

import { formatOrder } from './utils';
import OrderStatus from './OrderStatus';
import * as ActionGroup from '../ActionGroup/ActionGroup';

const OrderListItem = ({
  role,
  order,
  onButtonPress,
  onPress,
  style
}) => {
  const formattedOrder = formatOrder(order, role);

  return <TouchableRipple
    style={style}
    onPress={onPress}>
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
          showHeaderAvatar/>
      {onButtonPress && <List.Section>
          <ActionGroup.Group>
              <ActionGroup.Buttons 
                  buttons={formattedOrder.fulfilmentStatus.buttons}
                  onPress={(button) => onButtonPress(button, order.id)}  />
          </ActionGroup.Group>
      </List.Section>}
    </>
  </TouchableRipple>  
}

export default OrderListItem;
