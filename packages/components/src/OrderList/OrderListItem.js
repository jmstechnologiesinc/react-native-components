import React from 'react';

import { Card } from '@jmsstudiosinc/react-native-paper';

import { USER_ROLES } from '@jmsstudiosinc/user';
import {ORDER_STATUS, whatIsTheOrderStatus, formatOrderID, isOrderAssignedToDriver, orderStatusTime} from "@jmsstudiosinc/order";
import {firestoreTimestampToDate} from "@jmsstudiosinc/commons";

import OrderListCard from './OrderListCard';

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

  const renderOrderListCard = <OrderListCard 
    role={role}
    orderID={order.id}
    status={order.status}
    title={role === "vendor" ? order.author.formattedName : order.restaurant.title}
    photo={(role === "customer" || role === "driver") && order.restaurant.photo}
    description={''}
    pudMethod={order.deliveryMethod}
    orderID={order.id}
    formattedOrderId={formatOrderID(order.id)}
    fulfilmentStatus={fulfilmentStatus}
    driverAvatar={role !== USER_ROLES.driver && 
        isOrderAssignedToDriver(order.status) &&
        order?.driver &&
        (order.driver.profilePictureURL || order.driver.carPictureURL)
    }
    durationValue={order.eta.duration.value}
    deliveryTime={order.eta.deliveryTime.value}
    restaurantAcceptedTime={firestoreTimestampToDate(order[orderStatusTime(ORDER_STATUS.restaurantAccepted)])} />

  if(isCard) {
    return <Card mode="elevated" style={{margin: 8}}>{renderOrderListCard}</Card>
  }
  
  return renderOrderListCard
}

export default OrderListItem;
