import { USER_ROLES } from '@jmstechnologiesinc/user';
import { firestoreTimestampToDate,  getRoleFees } from '@jmstechnologiesinc/commons';

import {
    ORDER_STATUS,
    ORDER_STATUS_CANCELLED,
    ORDER_STATUS_PREPARING,
    whatIsTheOrderStatus,
    formatOrderID,
    orderStatusTime,
} from '@jmstechnologiesinc/order';
import { localized } from '../Localization/Localization';

export const formatOrder = (order, role) => {
    const formattedOrderId = formatOrderID(order.id);
    const fees = getRoleFees(order, role);

    const fulfilmentStatus = whatIsTheOrderStatus({
        role,
        fees,
        status: order.status,
        driverStatus: order?.driver?.status,
        formattedOrderId,
        formattedStatusTime: order.formattedStatusTime,
        itemNums: order.cart?.products?.length,
        fulfillmentMethod: order.fulfillmentMethod,
        deliveryMethod: order.deliveryMethod,
        pickupMethod: order.pickupMethod,
        driverDeliveryMethod: order?.driver?.deliveryMethod,
        vendorPhone: order.vendor?.phoneNumber,
        customerPhone: order.author?.phoneNumber,
        driverPhone: order.driver?.phoneNumber,
        formattedVendorTitle: order.vendor.title,
        formattedVendorAddress: order.vendor.location.formattedAddress,
        formattedDriverCar: order.driver?.vehicle?.formattedValue,
        formattedDriverName: order?.driver?.formattedName,
        formattedCustomerName: order.author.formattedName,
        formattedFulfillmentAddress: order.fulfillmentAddress.formattedAddress,
        vendorAvatar: order.vendor.photo,
        driverAvatar: order?.driver?.photo,
        translation: localized,
    });

    return {
        orderId: order.id,
        fees,
        fulfilmentStatus,
        status: order.status,
        photo: (role === USER_ROLES.customer || role === USER_ROLES.driver) && order.vendor.photo,
        deliveryMethod: order.deliveryMethod,
        formattedOrderId,
        durationValue: order.eta?.duration?.value,
        deliveryTime: order.eta?.deliveryTime?.value,
        formattedStatusTime: order.formattedStatusTime,
        vendorAcceptedTime: firestoreTimestampToDate(order[orderStatusTime(ORDER_STATUS.vendorAccepted)]),
    };
};

export const ORDER_LIST_STATUS = {
    ...ORDER_STATUS,
    cancelled: localized('order.cancelled'),
    preparing: localized('order.preparing'),
    history: localized('order.history'),
};

const ORDER_LIST_STATUS_MAPPING = {
    [ORDER_LIST_STATUS.preparing]: localized('order.inTheKitchen'),
    [ORDER_LIST_STATUS.completed]: localized('order.Completed'),
    [ORDER_LIST_STATUS.placed]: localized('order.Placed'),
    [ORDER_LIST_STATUS.inTransit]: localized('order.inTransit'),
    [ORDER_LIST_STATUS.readyforPickup]: localized('order.Ready for Pickup'),
    [ORDER_LIST_STATUS.cancelled]: localized('order.cancelled'),
    [ORDER_LIST_STATUS.vendorAccepted]: localized('order.Vendor Accepted'),
    [ORDER_LIST_STATUS.driverPending]: localized('order.Driver Pending'),
    [ORDER_LIST_STATUS.driverAccepted]: localized('order.Driver Accepted'),
    [ORDER_LIST_STATUS.driverCancelled]: localized('order.Driver Cancelled'),
    [ORDER_LIST_STATUS.driverRejected]: localized('order.Driver Rejected'),
    [ORDER_LIST_STATUS.selfCancelled]: localized('order.Self Cancelled'),
    [ORDER_LIST_STATUS.customerCancelled]: localized('order.Customer Cancelled'),
    [ORDER_LIST_STATUS.vendorCancelled]: localized('order.Vendor Cancelled'),
    [ORDER_LIST_STATUS.vendorRejected]: localized('order.Vendor Rejected'),
    [ORDER_LIST_STATUS.noDriverFound]: localized('order.No Driver Found'),
};

export const ROLE_ORDER_LIST_STATUS_MAPPING = {
    [USER_ROLES.vendor]: {
        ...ORDER_LIST_STATUS_MAPPING,
        [ORDER_LIST_STATUS.placed]: localized('order.newRequests'),
    },
    [USER_ROLES.customer]: {
        ...ORDER_LIST_STATUS_MAPPING,
    },
    [USER_ROLES.driver]: {
        ...ORDER_LIST_STATUS_MAPPING,
        [ORDER_STATUS.driverPending]: localized('order.newRequests'),
        [ORDER_STATUS.driverAccepted]: localized('order.pending'),
        [ORDER_STATUS.shipped]: localized('order.pickingUpfromVendor'),
    },
};

export const HISTORY_ORDER_LIST_STATUS_MAPPING = {
    ...ROLE_ORDER_LIST_STATUS_MAPPING,
    [USER_ROLES.vendor]: {
        ...ROLE_ORDER_LIST_STATUS_MAPPING.vendor,
        [ORDER_LIST_STATUS.completed]: localized('order.history'),
    },
    [USER_ROLES.customer]: {
        ...ROLE_ORDER_LIST_STATUS_MAPPING.customer,
        [ORDER_LIST_STATUS.completed]: localized('order.history'),
    },
    [USER_ROLES.driver]: {
        ...ROLE_ORDER_LIST_STATUS_MAPPING.driver,
        [ORDER_LIST_STATUS.completed]: localized('order.history'),
    },
};

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
        ORDER_LIST_STATUS.inTransit,
        ORDER_LIST_STATUS.placed,
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
};

export const orderListStatus = (status, role) => {
    if (role === USER_ROLES.driver) {
        if (ORDER_STATUS_CANCELLED(status) || status === ORDER_LIST_STATUS.completed) {
            return ORDER_LIST_STATUS.completed;
        }
    } else {
        if (ORDER_STATUS_PREPARING(status) || status === ORDER_LIST_STATUS.shipped) {
            return ORDER_LIST_STATUS.preparing;
        } else if (ORDER_STATUS_CANCELLED(status) || status === ORDER_LIST_STATUS.completed) {
            return ORDER_LIST_STATUS.completed;
        }
    }

    return status;
};
export const humanizeOrderStatus = (status) => {
    if (ORDER_STATUS_PREPARING(status) || status === ORDER_LIST_STATUS.shipped) {
        return ORDER_LIST_STATUS.preparing;
    } 

    return status;
}

export const groupedOrderListToSectionList = (groupedOrderList, role) => {
    if (!role) {
        return [];
    }

    let i = 0;
    const results = [];
    const orderListStatusSort = ROLE_ORDER_LIST_STATUS_SORT[role];
    const orderListStatusMapping = HISTORY_ORDER_LIST_STATUS_MAPPING[role];

    for (; i < orderListStatusSort.length; i++) {
        if (groupedOrderList.hasOwnProperty(orderListStatusSort[i])) {
            results.push({
                title: orderListStatusMapping[orderListStatusSort[i]],
                data: groupedOrderList[orderListStatusSort[i]],
            });
        }
    }

    return results;
};
