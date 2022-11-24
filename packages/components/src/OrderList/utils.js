
import { USER_ROLES } from '@jmsstudiosinc/user';
import {firestoreTimestampToDate, groupBy} from "@jmsstudiosinc/commons";
import {
    ORDER_STATUS, 
    ORDER_STATUS_CANCELLED,
    ORDER_STATUS_PREPARING,
    whatIsTheOrderStatus, 
    formatOrderID, 
    orderStatusTime,
} from "@jmsstudiosinc/order";
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

const ORDER_LIST_STATUS = {
    ...ORDER_STATUS,
    'cancelled': 'Cancelled',
    'preparing': 'Preparing',
}

const ORDER_LIST_STATUS_MAPPING = {
    [ORDER_LIST_STATUS.completed]: 'Fulfilled',
    [ORDER_LIST_STATUS.placed]: 'New Request',
    [ORDER_LIST_STATUS.inTransit]: 'In-Transit',
    [ORDER_LIST_STATUS.readyforPickup]: 'Ready for Pick up',
    [ORDER_LIST_STATUS.cancelled]: 'Cancelled',
    [ORDER_LIST_STATUS.preparing]: 'Preparing',
}

const ORDER_LIST_STATUS_SORT = [
    ORDER_LIST_STATUS.placed,
    ORDER_LIST_STATUS.preparing,
    ORDER_LIST_STATUS.inTransit,
    ORDER_LIST_STATUS.readyforPickup,
    ORDER_LIST_STATUS.completed,
    ORDER_LIST_STATUS.cancelled,
];

const orderListStatus = (status, role) => {
    if(role === USER_ROLES.vendor) {
        if (ORDER_STATUS_CANCELLED(status) === true) {
            return 'cancelled';
        } else if (ORDER_STATUS_PREPARING(status) || status === ORDER_LIST_STATUS.shipped) {
            return 'preparing';
        } 

        return status;
    } else if(role === USER_ROLES.customer) {
        if (ORDER_STATUS_PREPARING(status) || status === ORDER_LIST_STATUS.shipped) {
            return 'preparing';
        } else if (status === ORDER_LIST_STATUS.inTransit) {
            return ORDER_LIST_STATUS.inTransit;
        } else if (status === ORDER_LIST_STATUS.readyforPickup) {
            return ORDER_LIST_STATUS.readyforPickup
        }
    }
}

export const groupOrderList = (orderList, role) => {
    const groupedOrderList = groupBy(orderList, ({status}) => orderListStatus(status, role))

    let i = 0;
    const results = [];
    for(; i < ORDER_LIST_STATUS_SORT.length; i++) {
        if(groupedOrderList.hasOwnProperty(ORDER_LIST_STATUS_SORT[i])) {
            results.push({
              title: ORDER_LIST_STATUS_MAPPING[ORDER_LIST_STATUS_SORT[i]],
              data: groupedOrderList[ORDER_LIST_STATUS_SORT[i]]
            })
        } 
    }
  
    return results
  }