import React from 'react';

import { Card } from '@jmsstudiosinc/react-native-paper';

import { USER_ROLES } from '@jmsstudiosinc/user';
import { whatIsTheOrderStatus, formatOrderID, ORDER_STATUS } from "@jmsstudiosinc/order";

import OrderListVendor from './OrderListVendor';

const OrderListItem = ({
  role,
  order,
  isCard,
  onButtonPress,
  onPress
}) => {



  const fulfilmentStatus = whatIsTheOrderStatus({
    role,
    status: order.status,
    deliveryMethod: order.deliveryMethod,
    restaurantAddress: order.restaurant.location.formattedAddress,
    driverFirstName: order?.driver?.firstName,
    driverDeliveryMethod: order.deliveryMethod,
    driverStatus: order?.driver?.status,
    car: `${order.driver?.carName} - ${order.driver?.carNumber}`
  });

  let renderOrderListVendor;

  renderOrderListVendor = <OrderListVendor
    onButtonPress={onButtonPress}
    role={role}
    orderID={order.id}
    status={order.status}
    title={role === "vendor" ? order.author.firstName : order.restaurant.title}
    photo={(role === "customer") && order.restaurant.photos}
    description={role !== "driver" ? ` . ${order.products.length} items` : ''}
    pudMethod={order.deliveryMethod}
    formattedOrderId={formatOrderID(order.id)}
    eta={order.eta.formatted}
    fulfilmentStatus={fulfilmentStatus}
    avatar={role !== USER_ROLES.driver && order?.driver &&
      (order.status === ORDER_STATUS.shipped || order.status === ORDER_STATUS.inTransit) &&
      (order.driver.profilePictureURL || order.driver.carPictureURL)
    } />

  if (isCard) {
    return <Card mode="elevated" style={{ margin: 8 }} onPress={() => onPress(order, role)}>{renderOrderListVendor}</Card>
  }

  return renderOrderListVendor
}

export default OrderListItem;
