import { USER_ROLES } from '@jmstechnologiesinc/user';

import {
    ORDER_STATUS,
    ORDER_STATUS_CANCELLED,
    ORDER_STATUS_PREPARING,
} from '@jmstechnologiesinc/order';
import { localized } from '../Localization/Localization';

export const ORDER_LIST_STATUS = {
    ...ORDER_STATUS,
    cancelled: localized('order.cancelled'),
    preparing: localized('order.preparing'),
    history: localized('order.history'),
};

const ORDER_LIST_STATUS_MAPPING = {
    [ORDER_LIST_STATUS.preparing]: localized('order.ongoing'),
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
