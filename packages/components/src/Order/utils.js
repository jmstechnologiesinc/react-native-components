
import { USER_ROLES } from '@jmsstudiosinc/user';
import {firestoreTimestampToDate} from "@jmsstudiosinc/commons";
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
        photo: (role === USER_ROLES.customer || role === USER_ROLES.driver) && order.restaurant.photo,
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

export const ORDER_LIST_STATUS = {
    ...ORDER_STATUS,
    'cancelled': 'Cancelled',
    'preparing': 'Preparing',
}

const ORDER_LIST_STATUS_MAPPING = {
    [ORDER_LIST_STATUS.completed]: 'History',
    [ORDER_LIST_STATUS.placed]: 'New Requests',
    [ORDER_LIST_STATUS.inTransit]: 'In-Transit',
    [ORDER_LIST_STATUS.readyforPickup]: 'Ready for Pick up',
    [ORDER_LIST_STATUS.cancelled]: 'Cancelled',
    [ORDER_LIST_STATUS.preparing]: 'Preparing',
}

const ROLE_ORDER_LIST_STATUS_MAPPING = {
    [USER_ROLES.vendor]: ORDER_LIST_STATUS_MAPPING,
    [USER_ROLES.customer]: {
        ...ORDER_LIST_STATUS_MAPPING,
        [ORDER_LIST_STATUS.placed]: 'Placed',
    },
    [USER_ROLES.driver]: {
        ...ORDER_LIST_STATUS_MAPPING,
        [ORDER_STATUS.driverPending]: 'New Requests',  
        [ORDER_STATUS.driverAccepted]: 'Pending',
        [ORDER_STATUS.shipped]: 'Picking up from vendor',
    },
}

const ROLE_ORDER_LIST_STATUS_SORT = {
    [USER_ROLES.vendor]: [
        ORDER_LIST_STATUS.placed,
        ORDER_LIST_STATUS.preparing,
        ORDER_LIST_STATUS.inTransit,
        ORDER_LIST_STATUS.readyforPickup,
        ORDER_LIST_STATUS.completed,
        ORDER_LIST_STATUS.cancelled,
    ],
    [USER_ROLES.customer]: [    
        ORDER_LIST_STATUS.placed,    
        ORDER_LIST_STATUS.inTransit,
        ORDER_LIST_STATUS.readyforPickup,
        ORDER_LIST_STATUS.preparing,
        ORDER_LIST_STATUS.completed,
        ORDER_LIST_STATUS.cancelled,
    ],
    [USER_ROLES.driver]: [  
        ORDER_STATUS.driverPending,  
        ORDER_LIST_STATUS.inTransit,
        ORDER_STATUS.driverAccepted,
        ORDER_STATUS.shipped,
        ORDER_LIST_STATUS.completed,
    ],
}

export const orderListStatus = (status, role) => {
    if(role === USER_ROLES.driver) {
        if (ORDER_STATUS_CANCELLED(status) || status === ORDER_LIST_STATUS.completed) {
            return ORDER_LIST_STATUS.completed
        }
    } else {
        if (ORDER_STATUS_PREPARING(status) || status === ORDER_LIST_STATUS.shipped) {
            return ORDER_LIST_STATUS.preparing;
        } else if (ORDER_STATUS_CANCELLED(status) || status === ORDER_LIST_STATUS.completed) {
            return ORDER_LIST_STATUS.completed
        }
    }

    return status;
}

export const groupedOrderListToSectionList = (groupedOrderList, role) => {
    if(!role) {
        return [];
    }

    let i = 0;
    const results = [];
    const orderListStatusSort = ROLE_ORDER_LIST_STATUS_SORT[role];
    const orderListStatusMapping = ROLE_ORDER_LIST_STATUS_MAPPING[role];

    for(; i < orderListStatusSort.length; i++) {
        if(groupedOrderList.hasOwnProperty(orderListStatusSort[i])) {
            results.push({
              title: orderListStatusMapping[orderListStatusSort[i]],
              data: groupedOrderList[orderListStatusSort[i]]
            })
        }
    }
  
    return results
}