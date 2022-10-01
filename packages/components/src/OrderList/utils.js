
import { USER_ROLES } from '@jmsstudiosinc/user';
import {firestoreTimestampToDate} from "@jmsstudiosinc/commons";
import {ORDER_STATUS, whatIsTheOrderStatus, formatOrderID, isOrderAssignedToDriver, orderStatusTime} from "@jmsstudiosinc/order";
import {DELIVERY_METHODS} from "@jmsstudiosinc/vendor";

export const formatOrder = (order, role) => {
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
 
      return {
        orderID: order.id,
        status: order.status,
        title: role === "vendor" ? order.author.formattedName :   order.restaurant.title,
        photo: (role === "customer" || role === "driver") && order.restaurant.photo,
        deliveryMethod: order.deliveryMethod,
        formattedOrderId: formatOrderID(order.id),
        fulfilmentStatus: fulfilmentStatus,
        driverAvatar: role !== USER_ROLES.driver && 
            isOrderAssignedToDriver(order.status) &&
            order?.driver && (order.driver.profilePictureURL || order.driver.carPictureURL),
        durationValue: order.eta?.duration?.value,
        deliveryTime: order.eta?.deliveryTime?.value,
        formattedStatusTime: order.formattedStatusTime,
        restaurantAcceptedTime: firestoreTimestampToDate(order[orderStatusTime(ORDER_STATUS.restaurantAccepted)]),
        fees: (role === USER_ROLES.customer ? 
            order.customerFees : 
            role === USER_ROLES.vendor ? 
            order.restaurantFees : 
            !(role === USER_ROLES.driver && order.deliveryMethod === DELIVERY_METHODS.restaurantOwnStaff) ? 
            order.driverFees : 
            null
        )
    }
}
