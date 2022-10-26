
import { USER_ROLES } from '@jmsstudiosinc/user';
import {firestoreTimestampToDate} from "@jmsstudiosinc/commons";
import {ORDER_STATUS, whatIsTheOrderStatus, formatOrderID, isOrderAssignedToDriver, orderStatusTime} from "@jmsstudiosinc/order";
import {DELIVERY_METHODS} from "@jmsstudiosinc/vendor";

const getRoleFees = (order, role) => {
    if (role === USER_ROLES.customer) {
        return order.customerFees;
    } else if (role === USER_ROLES.vendor) {
        return order.restaurantFees;
    } else if (!(role === USER_ROLES.driver && order.deliveryMethod === DELIVERY_METHODS.restaurantOwnStaff)) {
        return order.driverFees;
    }

    return null;
};

export const formatOrder = (order, role) => {
    const formattedOrderId = formatOrderID(order.id);
    const fees = getRoleFees(order, role);

    const fulfilmentStatus = whatIsTheOrderStatus({
        role,
        fees,
        status: order.status,
        formattedOrderId,
        formattedStatusTime: order.formattedStatusTime,
        itemNums: order.products?.length,
        deliveryMethod: order.deliveryMethod,
        driverDeliveryMethod: order?.driver?.deliveryMethod,
        formattedDriverName: order?.driver?.firstName,
        formattedVendorTitle: order.restaurant.title,
        formattedVendorAddress: order.restaurant.location.formattedAddress,
        driverStatus: order?.driver?.status,
        car: `${order.driver?.carName} - ${order.driver?.carNumber}`,
        formattedCustomerName: order.author.formattedName,
        formattedShippingAddress: order.shippingAddress.formattedAddress,
        vendorAvatar: order.restaurant.photo,
        driverAvatar: order?.driver && (order.driver.profilePictureURL || order.driver.carPictureURL),
      });

      return {
        orderID: order.id,
        status: order.status,
        photo: (role === "customer" || role === "driver") && order.restaurant.photo,
        deliveryMethod: order.deliveryMethod,
        formattedOrderId,
        fulfilmentStatus: fulfilmentStatus,
        durationValue: order.eta?.duration?.value,
        deliveryTime: order.eta?.deliveryTime?.value,
        formattedStatusTime: order.formattedStatusTime,
        restaurantAcceptedTime: firestoreTimestampToDate(order[orderStatusTime(ORDER_STATUS.restaurantAccepted)]),
        fees
    }
}
