import React from 'react';

import { Card, List } from '@jmsstudiosinc/react-native-paper';

import { USER_ROLES } from '@jmsstudiosinc/user';

import { formatOrder } from './utils';
import OrderStatus from './OrderStatus';
import OrderActionButtons from './OrderActionButtons';
import * as JMSList from "../List/List";

const OrderListItem = ({
  role,
  order,
  onPress,
  onButtonPress,
}) => {
  const formattedOrder = formatOrder(order, role);

  const overlines = [formattedOrder.formattedOrderId];
  overlines.push(formattedOrder.fees?.total?.formattedValue);
  if(role !== USER_ROLES.driver) {
    overlines.push(`${order.products.length} Items`);
  }
  overlines.push(formattedOrder.formattedStatusTime);

  return <Card 
    mode="outlined"
    onPress={() => onPress(order, role)}
    style={{marginVertical: 4}}>
       <List.Section>
          <JMSList.ItemExtended
              overline={overlines.join(" · ") || null}
              header={formattedOrder.title}
              subHeader={order.status}
              titleVariant={'headlineSmall'} />
          <OrderStatus
            role={role}
            status={formattedOrder.status}
            deliveryMethod={formattedOrder.deliveryMethod}
            driverAvatar={formattedOrder.driverAvatar}
            durationValue={formattedOrder.durationValue}
            deliveryTime={formattedOrder.deliveryTime}
            restaurantAcceptedTime={formattedOrder.restaurantAcceptedTime}
            orderID={formattedOrder.orderID}
            fulfilmentStatus={formattedOrder.fulfilmentStatus} />
        </List.Section>   
      {onButtonPress && <OrderActionButtons 
        orderID={formattedOrder.orderID}
        buttons={formattedOrder.fulfilmentStatus.driver.buttons}
        onPress={onButtonPress} />}
  </Card>  
}

export default OrderListItem;
