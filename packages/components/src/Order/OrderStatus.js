import React from 'react';

import { View } from 'react-native';

import { Chip, MD3LightTheme } from '@jmsstudiosinc/react-native-paper';

import ListItemExtended from '../List/ListItemExtended';
import { interpunct } from '@jmsstudiosinc/commons';
import VendorStatus from './VendorStatus';
import DriverStatus from './DriverStatus';

const rightWrapper = (child) => (
    <View
        style={{
            justifyContent: 'center',
            marginLeft: MD3LightTheme.spacing.x4,
            marginRight: MD3LightTheme.spacing.x2,
        }}
    >
        {child}
    </View>
);

const OrderStatus = ({
    role,
    formattedOrder,
    showHeaderItems = true,
    showHeaderTotal = true,
    showHeaderTime = true,
    showHeaderAvatar = true,
    showHeaderDescription = true,
    showVendorOverline = true,
    showDriverStatus = true,
    showVendorStatus = true,
    headerTitleVariant,
    titleStyle,
    overlineStyle
}) => {
    const fulfilmentStatus = formattedOrder.fulfilmentStatus;
    const headerStatus = fulfilmentStatus.header;
    const vendorStatus = fulfilmentStatus.vendor;
    const driverStatus = fulfilmentStatus.driver;
   
    const renderStatuses = [];

    let headerOverlines = [headerStatus.overlines[0]];
    if(showHeaderItems === true) {
        headerOverlines.push(headerStatus.overlines[1]);
    }
    if(showHeaderTotal === true) {
        headerOverlines.push(headerStatus.overlines[2]);
    }
    if(showHeaderTime === true) {
        headerOverlines.push(headerStatus.overlines[3]);
    }

    if (headerStatus?.title) {
        renderStatuses.push(
            <ListItemExtended
                key="headerStatus"
                overline={interpunct(headerOverlines) || null}
                header={headerStatus.title}
                subHeader={showHeaderDescription && headerStatus.description}
                avatar={showHeaderAvatar && headerStatus.avatar}
                right={headerStatus.right && rightWrapper(<Chip>{headerStatus.right}</Chip>)}
                titleVariant={headerTitleVariant}
                titleStyle={overlineStyle}
                overlineStyle={overlineStyle}
            />
        );
    }

    if (showVendorStatus && vendorStatus.title) {
        renderStatuses.push(
            <VendorStatus 
                key="vendorStatus"
                role={role}
                orderID={formattedOrder.orderID}
                deliveryMethod={formattedOrder.deliveryMethod}
                status={formattedOrder.status}
                restaurantAcceptedTime={formattedOrder.restaurantAcceptedTime}
                deliveryTime={formattedOrder.deliveryTime}
                durationValue={formattedOrder.durationValue}

                overline={showVendorOverline && interpunct(vendorStatus.overlines) || null}
                header={vendorStatus.title}
                subHeader={vendorStatus.description}
                chips={vendorStatus.chips}
                avatar={vendorStatus.avatar}
                titleStyle={titleStyle}
                overlineStyle={overlineStyle} />
        );
    }
    
    if (showDriverStatus === true && (
        driverStatus.overlines.length > 0 || 
        driverStatus.title || 
        driverStatus.description || 
        driverStatus.chips.length > 0
    )) {
        renderStatuses.push(
            <DriverStatus
                key="DriverStatus"
                role={role}
                orderID={formattedOrder.orderID}
                deliveryMethod={formattedOrder.deliveryMethod}
                status={formattedOrder.status}
                overline={interpunct(driverStatus.overlines)  || null}
                header={driverStatus.title}
                subHeader={driverStatus.description}
                chips={driverStatus.chips}
                avatar={driverStatus.avatar}
                titleStyle={titleStyle}
                overlineStyle={overlineStyle} />
        );
    }
   
    return renderStatuses;
};

export default OrderStatus;
