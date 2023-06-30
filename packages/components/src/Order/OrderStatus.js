import React from 'react';

import { interpunct } from '@jmstechnologiesinc/commons';

import VendorStatus from './VendorStatus';
import DriverStatus from './DriverStatus';
import OrderStatusWrapper from './OrderStatusWrapper';

const OrderStatus = ({
    role,
    formattedOrder,

    enableDriverStatus = true,
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

    showDriverOverline,
    showDriverTitle,
    showDriverDescription,
    showDriverAvatar,

    headerTitleVariant,
    titleStyle,
    overlineStyle,
   
}) => {
    const fulfilmentStatus = formattedOrder.fulfilmentStatus;
    const headerStatus = fulfilmentStatus.header;
    const vendorStatus = fulfilmentStatus.vendor;
    const driverStatus = fulfilmentStatus.driver;

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
                subHeader={headerStatus.description}
                avatar={headerStatus.avatar}
                chips={headerStatus.chips}
                showOverline={showHeaderOverline}
                showTitle={showHeaderTitle}
                showDescription={showHeaderDescription}
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
                orderID={formattedOrder.orderID}
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
                showAvatar={showVendorAvatar}
                titleStyle={titleStyle}
                overlineStyle={overlineStyle}
                fastImageUrlWrapper={fastImageUrlWrapper}
            />
        );
    }

    if (
        enableDriverStatus &&
        (driverStatus.description.length > 0 || driverStatus.title || driverStatus.chips.length > 0)
    ) {
        renderStatuses.push(
            <DriverStatus
                key="DriverStatus"
                role={role}
                orderID={formattedOrder.orderID}
                deliveryMethod={formattedOrder.deliveryMethod}
                status={formattedOrder.status}
                overline={driverStatus.overlines}
                header={driverStatus.title}
                subHeader={driverStatus.description}
                chips={driverStatus.chips}
                avatar={driverStatus.avatar}
                showOverline={showDriverOverline}
                showTitle={showDriverTitle}
                showDescription={showDriverDescription}
                showAvatar={showDriverAvatar}
                titleStyle={titleStyle}
                overlineStyle={overlineStyle}
                fastImageUrlWrapper={fastImageUrlWrapper}
            />
        );
    }

    return renderStatuses;
};

export default OrderStatus;
