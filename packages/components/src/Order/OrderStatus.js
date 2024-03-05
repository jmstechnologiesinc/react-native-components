import React from 'react';

import { interpunct } from '@jmstechnologiesinc/commons';

import VendorStatus from './VendorStatus';
import OrderStatusWrapper from './OrderStatusWrapper';
import { ROLE_ORDER_LIST_STATUS_MAPPING, humanizeOrderStatus } from '@jmstechnologiesinc/react-native-components/lib/Order/utils';

const OrderStatus = ({
    role,
    formattedOrder,

    enableHeaderStatus = true,
    enableVendorStatus = true,

    showHeaderOverline,
    showHeaderTitle,
    showHeaderDescription,
    showHeaderAvatar,

    showVendorOverline = false,
    showVendorTitle,
    showVendorDescription,
    showVendorAvatar = false,

    showChevron,

    headerTitleVariant,
    titleStyle,
    overlineStyle,
   
}) => {
    const fulfilmentStatus = formattedOrder.fulfilmentStatus;
    const headerStatus = fulfilmentStatus.header;
    const vendorStatus = fulfilmentStatus.vendor;

    const renderStatuses = [];

    if (
        enableHeaderStatus &&
        (headerStatus.overlines.length > 0 ||
            headerStatus.title ||
            headerStatus.description ||
            headerStatus.chips.length > 0)
    ) {
        renderStatuses.push(
            <OrderStatusWrapper
                key="headerStatus"
                overline={interpunct(headerStatus.overlines)}
                header={headerStatus.title}
                subHeader={ROLE_ORDER_LIST_STATUS_MAPPING[role][humanizeOrderStatus(formattedOrder.status, role)]}
                avatar={headerStatus.avatar}
                chips={headerStatus.chips}
                showOverline={showHeaderOverline}
                showTitle={showHeaderTitle}
                showDescription={showHeaderDescription}
                showChevron={showChevron}
                showAvatar={showHeaderAvatar && headerStatus.avatar}
                titleVariant={headerTitleVariant}
                titleStyle={overlineStyle}
            />
        );
    }

    if (
        enableVendorStatus &&
        (vendorStatus.overlines.length > 0 ||
            vendorStatus.title ||
            vendorStatus.description ||
            vendorStatus.chips.length > 0)
    ) {
        renderStatuses.push(
            <VendorStatus
                key="vendorStatus"
                role={role}
                orderId={formattedOrder.orderId}
                deliveryMethod={formattedOrder.deliveryMethod}
                status={formattedOrder.status}
                vendorAcceptedTime={formattedOrder.vendorAcceptedTime}
                deliveryTime={formattedOrder.deliveryTime}
                durationValue={formattedOrder.durationValue}
                overline={vendorStatus.overlines}
                header={vendorStatus.title}
                subHeader={vendorStatus.description}
                chips={vendorStatus.chips}
                avatar={vendorStatus.avatar}
                showOverline={showVendorOverline}
                showTitle={showVendorTitle}
                showDescription={showVendorDescription}
                showChevron={showChevron}
                showAvatar={showVendorAvatar}
                titleStyle={titleStyle}
                overlineStyle={overlineStyle}
            />
        );
    }
    return renderStatuses;
};

export default OrderStatus;
