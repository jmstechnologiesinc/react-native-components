import { USER_ROLES } from '@jmstechnologiesinc/user';
import { firestoreTimestampToDate, interpunct, getRoleFees } from '@jmstechnologiesinc/commons';

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
        vendorPhone: order.vendor?.phone,
        customerPhone: order.author?.phone,
        driverPhone: order.driver?.phone,
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
        orderID: order.id,
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
};

const ORDER_LIST_STATUS_MAPPING = {
    [ORDER_LIST_STATUS.completed]: localized('order.history'),
    [ORDER_LIST_STATUS.placed]: localized('order.newRequests'),
    [ORDER_LIST_STATUS.inTransit]: localized('In Transit'),
    [ORDER_LIST_STATUS.readyforPickup]: localized('order.readyForPickup'),
    [ORDER_LIST_STATUS.cancelled]: localized('order.cancelled'),
    [ORDER_LIST_STATUS.preparing]: localized('order.preparing'),
};

const ROLE_ORDER_LIST_STATUS_MAPPING = {
    [USER_ROLES.vendor]: ORDER_LIST_STATUS_MAPPING,
    [USER_ROLES.customer]: {
        ...ORDER_LIST_STATUS_MAPPING,
        [ORDER_LIST_STATUS.placed]: localized('Placed'),
    },
    [USER_ROLES.driver]: {
        ...ORDER_LIST_STATUS_MAPPING,
        [ORDER_STATUS.driverPending]: localized('order.newRequests'),
        [ORDER_STATUS.driverAccepted]: localized('order.pending'),
        [ORDER_STATUS.shipped]: localized('order.pickingUpfromVendor'),
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

export const groupedOrderListToSectionList = (groupedOrderList, role) => {
    if (!role) {
        return [];
    }

    let i = 0;
    const results = [];
    const orderListStatusSort = ROLE_ORDER_LIST_STATUS_SORT[role];
    const orderListStatusMapping = ROLE_ORDER_LIST_STATUS_MAPPING[role];

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
